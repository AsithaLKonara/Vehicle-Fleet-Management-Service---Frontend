import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Fill in credentials
    await page.fill('input[type="email"]', 'admin@fleet.com');
    await page.fill('input[type="password"]', 'admin123');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Operational Overview' })).toBeVisible({ timeout: 10000 });
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'wrong@fleet.com');
    await page.fill('input[type="password"]', 'wrongpass');
    await page.click('button[type="submit"]');

    await expect(page.locator('p.text-red-400')).toBeVisible();
    await expect(page.locator('p.text-red-400')).toContainText('Invalid email or password');
  });
});
