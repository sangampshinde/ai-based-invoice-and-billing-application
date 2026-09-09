import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class DraftReminderDto {
  @IsString()
  @IsNotEmpty()
  invoiceNumber: string;

  @IsString()
  @IsNotEmpty()
  clientName: string;

  @IsNotEmpty()
  amount: number | string;

  @IsString()
  @IsNotEmpty()
  dueDate: string;
}

export class DraftInvoiceNotesDto {
  @IsOptional()
  @IsString()
  terms?: string;

  @IsOptional()
  @IsString()
  projectType?: string;
}

export class AgentMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsArray()
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}
