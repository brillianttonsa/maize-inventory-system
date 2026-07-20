import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DbModule } from './db/db.module';
import { AuthModule } from './modules/auth/auth.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { ProcurementModule } from './modules/procurement/procurement.module';
import { ProductionModule } from './modules/production/production.module';
import { SalesModule } from './modules/sales/sales.module';
// import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { SettingsModule } from './modules/settings/settings.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AiAnalyticsModule } from './modules/ai-analytics/ai-analytics.module';

@Module({
  imports: [
    DbModule,
    AuthModule,
    ExpensesModule,
    ProcurementModule,
    ProductionModule,
    SalesModule,
    ContactsModule,
    SettingsModule,
    InventoryModule,
    ReportsModule,
    AiAnalyticsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
