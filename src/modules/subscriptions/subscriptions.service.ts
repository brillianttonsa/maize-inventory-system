import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { DB_PROVIDER, type DbClient } from '../../db/db.module';
import { subscriptionPlans, subscriptions, subscriptionPayments } from '../../db/schema';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';

// How many calendar days a billing cycle spans, used to compute end_date
const BILLING_CYCLE_DAYS: Record<string, number> = {
  quarterly: 90,
  semi_annually: 182,
  yearly: 365,
};

const TRIAL_PERIOD_DAYS = 14;

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

@Injectable()
export class SubscriptionsService {
  constructor(@Inject(DB_PROVIDER) private readonly db: DbClient) {}

  // ---------- Plans ----------

  findActivePlans() {
    return this.db.query.subscriptionPlans.findMany({
      where: eq(subscriptionPlans.is_active, true),
    });
  }

  async createPlan(dto: CreatePlanDto) {
    const [plan] = await this.db
      .insert(subscriptionPlans)
      .values({
        name: dto.name,
        description: dto.description,
        price: String(dto.price),
        billing_cycle: dto.billing_cycle,
        has_ai_access: dto.has_ai_access ?? false,
      })
      .returning();
    return plan;
  }

  async updatePlan(id: string, dto: UpdatePlanDto) {
    const [plan] = await this.db
      .update(subscriptionPlans)
      .set({
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.price !== undefined && { price: String(dto.price) }),
        ...(dto.billing_cycle !== undefined && {
          billing_cycle: dto.billing_cycle,
        }),
        ...(dto.has_ai_access !== undefined && {
          has_ai_access: dto.has_ai_access,
        }),
        ...(dto.is_active !== undefined && { is_active: dto.is_active }),
      })
      .where(eq(subscriptionPlans.id, id))
      .returning();

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }
    return plan;
  }

  // ---------- Subscriptions ----------

  async getMySubscription(userId: string) {
    const [row] = await this.db
      .select({
        subscription: subscriptions,
        plan: subscriptionPlans,
      })
      .from(subscriptions)
      .leftJoin(subscriptionPlans, eq(subscriptions.plan_id, subscriptionPlans.id))
      .where(eq(subscriptions.user_id, userId))
      .orderBy(desc(subscriptions.created_at))
      .limit(1);

    if (!row) {
      throw new NotFoundException('No subscription found for this user');
    }
    return { ...row.subscription, plan: row.plan };
  }

  async subscribe(userId: string, dto: CreateSubscriptionDto) {
    const plan = await this.db.query.subscriptionPlans.findFirst({
      where: and(
        eq(subscriptionPlans.id, dto.plan_id),
        eq(subscriptionPlans.is_active, true),
      ),
    });
    if (!plan) {
      throw new NotFoundException('Subscription plan not found or inactive');
    }

    // Block starting a second subscription while one is already active/trialing
    const existing = await this.db.query.subscriptions.findFirst({
      where: eq(subscriptions.user_id, userId),
      orderBy: desc(subscriptions.created_at),
    });
    if (existing && ['trialing', 'active', 'past_due'].includes(existing.status)) {
      throw new ConflictException('User already has an active subscription');
    }

    const now = new Date();
    const trialEnd = addDays(now, TRIAL_PERIOD_DAYS);
    const cycleDays = BILLING_CYCLE_DAYS[plan.billing_cycle];
    const endDate = addDays(trialEnd, cycleDays);

    const [subscription] = await this.db
      .insert(subscriptions)
      .values({
        user_id: userId,
        plan_id: plan.id,
        status: 'trialing',
        start_date: now,
        trial_end_date: trialEnd,
        end_date: endDate,
      })
      .returning();

    return subscription;
  }

  async cancel(userId: string, subscriptionId: string) {
    const [updated] = await this.db
      .update(subscriptions)
      .set({ cancel_at_period_end: true, updated_at: new Date() })
      .where(
        and(
          eq(subscriptions.id, subscriptionId),
          eq(subscriptions.user_id, userId),
        ),
      )
      .returning();

    if (!updated) {
      throw new NotFoundException('Subscription not found');
    }
    return updated;
  }

  // ---------- Payments ----------

  async recordPayment(userId: string, dto: CreatePaymentDto) {
    const subscription = await this.db.query.subscriptions.findFirst({
      where: and(
        eq(subscriptions.id, dto.subscription_id),
        eq(subscriptions.user_id, userId),
      ),
    });
    if (!subscription) {
      throw new BadRequestException('Subscription does not belong to this user');
    }

    const [payment] = await this.db
      .insert(subscriptionPayments)
      .values({
        user_id: userId,
        subscription_id: dto.subscription_id,
        amount: String(dto.amount),
        payment_method: dto.payment_method,
        transaction_reference: dto.transaction_reference,
        status: dto.status,
      })
      .returning();

    // A successful payment moves a trialing/past_due subscription to active
    if (dto.status === 'success') {
      await this.db
        .update(subscriptions)
        .set({ status: 'active', updated_at: new Date() })
        .where(eq(subscriptions.id, dto.subscription_id));
    }

    return payment;
  }
}
