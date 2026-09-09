import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ClientsService } from '../clients/clients.service';
import { InvoicesService } from '../invoices/invoices.service';
import { PaymentsService } from '../payments/payments.service';
import { ExpensesService } from '../expenses/expenses.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { AiService } from './ai.service';
import { RedisService } from '../../redis/redis.service';

export interface AgentStep {
  type: 'thought' | 'tool_call' | 'tool_result';
  tool?: string;
  args?: any;
  content?: string;
  output?: any;
}

export interface AgentResponse {
  reply: string;
  steps: AgentStep[];
  actions?: Array<{ label: string; action?: string; url?: string; payload?: any }>;
}

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);

  constructor(
    private clientsService: ClientsService,
    private invoicesService: InvoicesService,
    private paymentsService: PaymentsService,
    private expensesService: ExpensesService,
    private analyticsService: AnalyticsService,
    private aiService: AiService,
    private redisService: RedisService,
  ) {}

  async processMessage(
    userId: string,
    message: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  ): Promise<AgentResponse> {
    const q = message.toLowerCase();
    const steps: AgentStep[] = [];

    // Store in Redis conversation history
    const sessionKey = `agent_history:${userId}`;
    await this.redisService.set(sessionKey, [...history, { role: 'user', content: message }], 3600);

    // Scenario 1: Overdue Invoices & Reminders
    if (q.includes('overdue') || (q.includes('remind') && q.includes('invoice')) || q.includes('unpaid')) {
      steps.push({
        type: 'thought',
        content: 'Analyzing database for unpaid and overdue invoices...',
      });

      steps.push({
        type: 'tool_call',
        tool: 'getInvoices',
        args: { filter: 'overdue' },
      });

      const allInvoices = await this.invoicesService.getInvoices(userId);
      const overdue = allInvoices.filter(
        (i) => i.status === 'overdue' || (i.status === 'unpaid' && new Date(i.due_date) < new Date()),
      );

      steps.push({
        type: 'tool_result',
        tool: 'getInvoices',
        output: `Found ${overdue.length} overdue invoice(s) totaling $${overdue.reduce((s, i) => s + i.total, 0).toLocaleString()}`,
      });

      if (overdue.length > 0) {
        const top = overdue.sort((a, b) => b.total - a.total)[0];
        steps.push({
          type: 'thought',
          content: `Highest overdue account is ${top.client_name} for invoice ${top.invoice_number} ($${top.total}). Generating firm payment reminder draft...`,
        });

        const reminder = await this.aiService.draftReminder({
          invoiceNumber: top.invoice_number,
          clientName: top.client_name || 'Valued Client',
          amount: top.total,
          dueDate: top.due_date,
        });

        steps.push({
          type: 'tool_result',
          tool: 'draftReminder',
          output: `Drafted: "${reminder.subject}"`,
        });

        return {
          reply: `I discovered ${overdue.length} overdue invoice(s). The most critical is ${top.invoice_number} for ${top.client_name} totaling $${top.total.toLocaleString()}. I have prepared a payment reminder draft for you.`,
          steps,
          actions: [
            { label: `View ${top.invoice_number}`, url: `/invoices/${top.id}` },
            {
              label: `Dispatch Reminder to ${top.client_name}`,
              action: 'dispatch_reminder',
              payload: { subject: reminder.subject, body: reminder.body, to: top.client_email },
            },
          ],
        };
      }

      return {
        reply: 'Great news! All invoices are currently settled or in good standing with zero overdue accounts.',
        steps,
      };
    }

    // Scenario 2: Financial Health & Performance Audit
    if (q.includes('health') || q.includes('kpi') || q.includes('metric') || q.includes('revenue') || q.includes('audit')) {
      steps.push({
        type: 'thought',
        content: 'Querying analytical metrics, cashflow collections, and aging buckets...',
      });

      steps.push({
        type: 'tool_call',
        tool: 'getDashboardStats',
        args: {},
      });

      const stats: any = await this.analyticsService.getDashboardStats(userId);

      steps.push({
        type: 'tool_result',
        tool: 'getDashboardStats',
        output: `Total Collected: $${stats.metrics.total_collected}, Outstanding: $${stats.metrics.outstanding}, Overdue: $${stats.metrics.overdue_amount}`,
      });

      steps.push({
        type: 'thought',
        content: 'Synthesizing executive financial audit and recommending priority actions...',
      });

      const summary = await this.aiService.generateSummary(userId);

      return {
        reply: summary.summary,
        steps,
        actions: [
          { label: 'View Analytics Dashboard', url: '/dashboard' },
          { label: 'Check Aging Receivables', url: '/reports' },
        ],
      };
    }

    // Scenario 3: Client Overview
    if (q.includes('client') || q.includes('customer')) {
      steps.push({
        type: 'thought',
        content: 'Retrieving client directory with financial exposure...',
      });

      steps.push({
        type: 'tool_call',
        tool: 'getClients',
        args: {},
      });

      const clients = await this.clientsService.getClients(userId);

      steps.push({
        type: 'tool_result',
        tool: 'getClients',
        output: `Retrieved ${clients.length} active clients`,
      });

      const topClient = clients.slice().sort((a, b) => b.total_billed - a.total_billed)[0];

      return {
        reply: `You have ${clients.length} registered clients. Your highest-billing client is **${topClient?.name || 'N/A'}** with $${(topClient?.total_billed || 0).toLocaleString()} billed to date.`,
        steps,
        actions: [
          { label: 'Open Client Directory', url: '/clients' },
          { label: 'Add New Client', url: '/clients?new=true' },
        ],
      };
    }

    // Default Autonomous Response
    steps.push({
      type: 'thought',
      content: 'Evaluating prompt intent against financial tools registry...',
    });

    return {
      reply: `I am your Autonomous Financial Copilot. I can audit accounts receivable, detect overdue invoices, draft reminders, scan receipts, and inspect your financial health. What would you like me to analyze?`,
      steps: [
        { type: 'thought', content: 'Ready to execute billing tools on command.' },
      ],
      actions: [
        { label: 'Audit Overdue Invoices', action: 'query_overdue' },
        { label: 'Run Financial Health Check', action: 'query_health' },
      ],
    };
  }
}
