import type { TranslateRequest, TranslateResponse } from './types';
import { getApiBaseUrl } from './env';

export async function translate(input: TranslateRequest): Promise<TranslateResponse> {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}/api/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('翻译失败，请稍后重试。');
  }

  return response.json() as Promise<TranslateResponse>;
}
