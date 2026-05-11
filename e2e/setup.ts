import { request } from '@playwright/test';

export async function resetDatabase() {
  const context = await request.newContext();
  await context.post('http://localhost:5000/test/reset');
  await context.dispose();
}
