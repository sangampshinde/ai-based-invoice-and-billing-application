import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';

export function createGeminiClient(configService: ConfigService): GoogleGenAI | null {
  const apiKey = configService.get<string>('GEMINI_API_KEY');
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}
