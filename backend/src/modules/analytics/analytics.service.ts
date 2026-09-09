import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private dataSource: DataSource,
    private redisService: RedisService,
  ) {}

  async getDashboardStats(userId: string) {
    const cacheKey = `dashboard:${userId}:stats`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return cached;
    }

    // 1. Aggregated KPI Stats
    const statsQuery = `
      SELECT 
        COALESCE(SUM(CASE WHEN status = 'paid' THEN total ELSE 0 END), 0) AS total_collected,
        COALESCE(SUM(CASE WHEN status != 'paid' THEN total ELSE 0 END), 0) AS outstanding,
        COALESCE(SUM(CASE WHEN status = 'paid' AND issue_date >= DATE_TRUNC('month', CURRENT_DATE) THEN total ELSE 0 END), 0) AS paid_this_month,
        COALESCE(COUNT(CASE WHEN due_date < CURRENT_DATE AND status != 'paid' THEN 1 END), 0) AS overdue_count,
        COALESCE(SUM(CASE WHEN due_date < CURRENT_DATE AND status != 'paid' THEN total ELSE 0 END), 0) AS overdue_amount
      FROM invoices
      WHERE user_id = $1
    `;
    const statsRes = await this.dataSource.query(statsQuery, [userId]);

    // 2. 6-Month Monthly Revenue Trend
    const revenueQuery = `
      SELECT TO_CHAR(issue_date, 'Mon') as month, SUM(total) as revenue
      FROM invoices
      WHERE user_id = $1 AND status = 'paid' AND issue_date >= NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR(issue_date, 'Mon'), DATE_TRUNC('month', issue_date)
      ORDER BY DATE_TRUNC('month', issue_date) ASC
    `;
    const trendRes = await this.dataSource.query(revenueQuery, [userId]);

    // 3. Aging Report Buckets (1-30, 31-60, 61-90, 90+)
    const agingQuery = `
      SELECT 
        COALESCE(SUM(CASE WHEN CURRENT_DATE - due_date BETWEEN 1 AND 30 THEN total ELSE 0 END), 0) AS bucket_30,
        COALESCE(SUM(CASE WHEN CURRENT_DATE - due_date BETWEEN 31 AND 60 THEN total ELSE 0 END), 0) AS bucket_60,
        COALESCE(SUM(CASE WHEN CURRENT_DATE - due_date BETWEEN 61 AND 90 THEN total ELSE 0 END), 0) AS bucket_90,
        COALESCE(SUM(CASE WHEN CURRENT_DATE - due_date > 90 THEN total ELSE 0 END), 0) AS bucket_90_plus
      FROM invoices
      WHERE user_id = $1 AND status != 'paid' AND due_date < CURRENT_DATE
    `;
    const agingRes = await this.dataSource.query(agingQuery, [userId]);

    const result = {
      metrics: {
        total_collected: Number(statsRes[0]?.total_collected || 0),
        outstanding: Number(statsRes[0]?.outstanding || 0),
        paid_this_month: Number(statsRes[0]?.paid_this_month || 0),
        overdue_count: Number(statsRes[0]?.overdue_count || 0),
        overdue_amount: Number(statsRes[0]?.overdue_amount || 0),
      },
      trend: (trendRes || []).map((t: any) => ({
        month: t.month,
        revenue: Number(t.revenue || 0),
      })),
      aging: {
        bucket_30: Number(agingRes[0]?.bucket_30 || 0),
        bucket_60: Number(agingRes[0]?.bucket_60 || 0),
        bucket_90: Number(agingRes[0]?.bucket_90 || 0),
        bucket_90_plus: Number(agingRes[0]?.bucket_90_plus || 0),
      },
    };

    // Cache in Redis for 5 minutes
    await this.redisService.set(cacheKey, result, 300);

    return result;
  }
}
