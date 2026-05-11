import { test, expect } from '@playwright/test';

test.describe('Assignment Lifecycle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@fleet.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should dispatch and return a vehicle', async ({ page }) => {
    await page.goto('/assignments');
    await page.click('button:has-text("Dispatch Vehicle")');
    
    // Select first available vehicle and staff
    await page.selectOption('select[name="vehicleId"]', { index: 1 });
    await page.selectOption('select[name="driverId"]', { index: 1 });
    
    await page.click('button:has-text("Confirm Dispatch")');
    
    // Check if it appears in the list as "In Transit"
    await expect(page.locator('text=In Transit').first()).toBeVisible();
    
    // Perform return
    await page.click('button:has-text("Mark Returned")');
    
    // Verify it marked as "Completed"
    await expect(page.locator('text=Completed').first()).toBeVisible();
  });
});
