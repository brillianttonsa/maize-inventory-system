import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { DB_PROVIDER, type DbClient } from '../../../db/db.module';
import { subscriptions, subscriptionPlans } from '../../../db/schema';
import type { AuthenticatedRequest } from '../../auth/guards/jwt-auth.guard';

const ACTIVE_STATUSES = ['trialing', 'active'];

@Injectable()
export class AiAccessGuard implements CanActivate {
  constructor(@Inject(DB_PROVIDER) private readonly db: DbClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userId = request.user.id;

    const [row] = await this.db
      .select({
        status: subscriptions.status,
        hasAiAccess: subscriptionPlans.has_ai_access,
      })
      .from(subscriptions)
      .leftJoin(subscriptionPlans, eq(subscriptions.plan_id, subscriptionPlans.id))
      .where(eq(subscriptions.user_id, userId))
      .orderBy(desc(subscriptions.created_at))
      .limit(1);

    if (!row) {
      throw new ForbiddenException('An active subscription is required to use AI Analytics');
    }

    if (!ACTIVE_STATUSES.includes(row.status)) {
      throw new ForbiddenException(
        'Your subscription is not active. Renew it to keep using AI Analytics',
      );
    }

    if (!row.hasAiAccess) {
      throw new ForbiddenException('Your current plan does not include AI Analytics');
    }

    return true;
  }
}
