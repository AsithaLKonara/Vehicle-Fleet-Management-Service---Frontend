import { test, expect } from '@playwright/test';
import { resetDatabase } from './setup';

test.describe('Vehicle Management', () => {
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

  test('should register a new vehicle', async ({ page }) => {
    await page.goto('/vehicles');
    await page.click('button:has-text("Register Vehicle")');
    
    const uniquePlate = `QA-${Date.now().toString().slice(-6)}`;
    await page.fill('[data-testid="vehicle-plate"]', uniquePlate);
    await page.fill('[data-testid="vehicle-make"]', 'Tesla');
    await page.fill('[data-testid="vehicle-model"]', 'Model S');
    await page.fill('[data-testid="vehicle-year"]', '2024');
    await page.fill('[data-testid="vehicle-cost"]', '80000');
    await page.selectOption('[data-testid="vehicle-type"]', 'CAR');
    
    await page.click('[data-testid="vehicle-submit"]');
    
    // Wait for modal to close
    await expect(page.locator('[data-testid="vehicle-modal-title"]')).not.toBeVisible({ timeout: 10000 });
    
    // Wait for list to update and verify the plate exists in the table
    const plateCell = page.locator(`[data-testid="vehicle-plate-cell"]:has-text("${uniquePlate}")`);
    await expect(plateCell).toBeVisible({ timeout: 10000 });
  });

  test('should filter vehicles by status', async ({ page }) => {
    await page.goto('/vehicles');
    
    // Select "Available" status from dropdown
    await page.selectOption('select', 'AVAILABLE');
    
    // Verify only available vehicles are shown
    const statusBadges = page.locator('span:has-text("AVAILABLE")');
    await expect(statusBadges.first()).toBeVisible({ timeout: 10000 });
    
    // Select "Assigned" status (none should be assigned after reset)
    await page.selectOption('select', 'ASSIGNED');
    await expect(page.locator('text=No vehicles found')).toBeVisible({ timeout: 10000 });
  });
});
