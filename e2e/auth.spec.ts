import { test, expect } from '@playwright/test';
import { resetDatabase } from './setup';

test.describe('Authentication Flow', () => {
  test.beforeAll(async () => {
    await resetDatabase();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[data-testid="login-email"]', 'admin@fleet.com');
    await page.fill('[data-testid="login-password"]', 'admin123');
    await page.click('[data-testid="login-submit"]');

    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Operational Overview' })).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="login-email"]', 'wrong@fleet.com');
    await page.fill('[data-testid="login-password"]', 'wrongpass');
    await page.click('[data-testid="login-submit"]');

    await expect(page.locator('[data-testid="login-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-error"]')).toContainText('Invalid email or password');
  });
});
