import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai.service';
import { AgentService } from './agent.service';
import { AiController } from './ai.controller';
import { ClientsModule } from '../clients/clients.module';
import { InvoicesModule } from '../invoices/invoices.module';
import { PaymentsModule } from '../payments/payments.module';
import { ExpensesModule } from '../expenses/expenses.module';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [
    ConfigModule,
    ClientsModule,
    InvoicesModule,
    PaymentsModule,
    ExpensesModule,
    AnalyticsModule,
  ],
  controllers: [AiController],
  providers: [AiService, AgentService],
  exports: [AiService, AgentService],
})
export class AiModule {}
