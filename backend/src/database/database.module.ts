import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  User,
  Client,
  Invoice,
  InvoiceItem,
  Payment,
  Expense,
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const entities = [User, Client, Invoice, InvoiceItem, Payment, Expense];
        const isProduction = configService.get<string>('NODE_ENV') === 'production';

        if (databaseUrl) {
          const isNeonOrRemote = databaseUrl.includes('neon.tech') || databaseUrl.includes('sslmode=require');
          return {
            type: 'postgres',
            url: databaseUrl,
            entities,
            synchronize: true, // auto-sync schema
            ssl: isNeonOrRemote ? { rejectUnauthorized: false } : false,
            logging: isProduction ? false : ['error', 'warn'],
          };
        }

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST', '127.0.0.1'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get<string>('DB_USERNAME', 'postgres'),
          password: configService.get<string>('DB_PASSWORD', 'postgres'),
          database: configService.get<string>('DB_NAME', 'invoicer_db'),
          entities,
          synchronize: true,
          logging: isProduction ? false : ['error', 'warn'],
        };
      },
    }),
  ],
})
export class DatabaseModule {}
