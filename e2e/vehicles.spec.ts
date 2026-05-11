import { test, expect } from '@playwright/test';

test.describe('Vehicle Management', () => {
  test.beforeEach(async ({ page }) => {
    // Standardized login flow for E2E
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@fleet.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should register a new vehicle', async ({ page }) => {
    await page.goto('/vehicles');
    await page.click('button:has-text("Register Asset")');
    
    await page.fill('input[name="plateNumber"]', 'QA-TEST-' + Date.now().toString().slice(-4));
    await page.fill('input[name="make"]', 'Tesla');
    await page.fill('input[name="model"]', 'Model S');
    await page.fill('input[name="year"]', '2024');
    await page.fill('input[name="purchaseCost"]', '80000');
    await page.selectOption('select[name="type"]', 'CAR');
    
    await page.click('button:has-text("Finalize Registration")');
    
    await expect(page.locator('text=Tesla Model S')).toBeVisible();
  });

  test('should filter vehicles by status', async ({ page }) => {
    await page.goto('/vehicles');
    await page.click('button:has-text("Filter")');
    await page.click('text=Available Only');
    
    // Verify only available vehicles are shown
    const statusBadges = page.locator('span:has-text("AVAILABLE")');
    const count = await statusBadges.count();
    expect(count).toBeGreaterThan(0);
    
    await expect(page.locator('span:has-text("ASSIGNED")')).not.toBeVisible();
  });
});
