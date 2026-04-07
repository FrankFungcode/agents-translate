import type { TranslateRequest, TranslateResponse } from './types';

export async function translate(input: TranslateRequest): Promise<TranslateResponse> {
  const response = await fetch('/api/translate', {
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
