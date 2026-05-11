import { test, expect } from '@playwright/test';
import { resetDatabase } from './setup';

test.describe('Assignment Lifecycle', () => {
  test.beforeAll(async () => {
    await resetDatabase();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="login-email"]', 'admin@fleet.com');
    await page.fill('[data-testid="login-password"]', 'admin123');
    await page.click('[data-testid="login-submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should dispatch and return a vehicle', async ({ page }) => {
    await page.goto('/assignments');
    
    // Check if there's an available vehicle (seeded vehicles)
    await page.click('button:has-text("Dispatch Vehicle")');
    
    // Fill assignment form
    // Wait for options to load
    await expect(page.locator('[data-testid="assignment-vehicle-select"] option')).toHaveCount(3); // Placeholder + 2 vehicles
    
    await page.selectOption('[data-testid="assignment-vehicle-select"]', 'c0a80101-0000-0000-0000-000000000001');
    // We don't know the exact UUID of the driver as it's generated, so we'll use index or label for driver
    await page.selectOption('[data-testid="assignment-driver-select"]', { label: 'Fleet Staff' });
    
    await page.click('[data-testid="assignment-submit"]');
    
    // Wait for modal to close
    await expect(page.getByText('New Dispatch')).not.toBeVisible({ timeout: 10000 });
    
    // Wait for success toast/message or status to update
    await expect(page.locator('span:has-text("In Transit")').first()).toBeVisible({ timeout: 10000 });
    
    // Test return
    // The ID of the assignment we just created is not easily available, so we'll look for the first return button
    await page.click('[data-testid^="return-button-"]');
    await expect(page.locator('span:has-text("Completed")').first()).toBeVisible({ timeout: 10000 });
  });
});
