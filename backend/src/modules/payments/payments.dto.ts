import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RecordPaymentDto {
  @IsString()
  @IsNotEmpty()
  invoiceId: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  paymentDate?: string;

  @IsString()
  @IsOptional()
  method?: string;
}
