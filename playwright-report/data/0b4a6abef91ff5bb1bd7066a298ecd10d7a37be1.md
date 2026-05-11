# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: vehicles.spec.ts >> Vehicle Management >> should register a new vehicle
- Location: e2e/vehicles.spec.ts:13:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Register Asset")')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - navigation [ref=e3]:
      - button [ref=e4]:
        - img [ref=e5]
      - generic [ref=e7]:
        - generic [ref=e8]: U
        - generic [ref=e9]: UltraDrive
      - generic [ref=e10]:
        - link "Dashboard" [ref=e11] [cursor=pointer]:
          - /url: /dashboard
          - img [ref=e12]
          - generic [ref=e14]: Dashboard
        - link "Vehicle Fleet" [ref=e15] [cursor=pointer]:
          - /url: /vehicles
          - img [ref=e16]
          - generic [ref=e18]: Vehicle Fleet
        - link "User Management" [ref=e20] [cursor=pointer]:
          - /url: /users
          - img [ref=e21]
          - generic [ref=e23]: User Management
        - link "Assignments" [ref=e24] [cursor=pointer]:
          - /url: /assignments
          - img [ref=e25]
          - generic [ref=e27]: Assignments
        - link "Audit History" [ref=e28] [cursor=pointer]:
          - /url: /audit
          - img [ref=e29]
          - generic [ref=e31]: Audit History
      - generic [ref=e32]:
        - generic [ref=e33]:
          - paragraph [ref=e34]: OPERATOR
          - generic [ref=e35]:
            - generic [ref=e36]: S
            - generic [ref=e37]:
              - paragraph [ref=e38]: System Admin
              - paragraph [ref=e39]: ADMIN
        - button "Terminate Session" [ref=e40]:
          - img [ref=e41]
          - generic [ref=e43]: Terminate Session
    - main [ref=e44]:
      - generic [ref=e45]:
        - generic [ref=e46]:
          - generic [ref=e47]:
            - heading "Vehicle Fleet" [level=1] [ref=e48]
            - paragraph [ref=e49]: Monitor and manage all company assets in real-time.
          - button "Register Vehicle" [ref=e50]:
            - img [ref=e51]
            - text: Register Vehicle
        - generic [ref=e53]:
          - generic [ref=e54]:
            - img [ref=e55]
            - textbox "Search by plate, make, or model..." [ref=e57]
          - generic [ref=e59]:
            - img [ref=e60]
            - combobox [ref=e62] [cursor=pointer]:
              - option "All Statuses" [selected]
              - option "Available"
              - option "Assigned"
              - option "Maintenance"
        - generic [ref=e64]:
          - generic [ref=e65]:
            - generic [ref=e66]:
              - img [ref=e68]
              - generic [ref=e70]: ASSIGNED
              - generic [ref=e71]: Van
            - generic [ref=e72]:
              - generic [ref=e73]:
                - generic [ref=e74]:
                  - heading "Toyota Hiace(2022)" [level=3] [ref=e75]:
                    - text: Toyota Hiace
                    - generic [ref=e76]: (2022)
                  - generic [ref=e77]:
                    - img [ref=e78]
                    - generic [ref=e80]: ABC-1234
                - img [ref=e82]
              - generic [ref=e85]:
                - button "View Details" [ref=e86]
                - button "Service" [ref=e87]:
                  - img [ref=e88]
                  - text: Service
          - generic [ref=e90]:
            - generic [ref=e91]:
              - img [ref=e93]
              - generic [ref=e95]: AVAILABLE
              - generic [ref=e96]: Van
            - generic [ref=e97]:
              - generic [ref=e98]:
                - generic [ref=e99]:
                  - heading "Nissan NV350(2023)" [level=3] [ref=e100]:
                    - text: Nissan NV350
                    - generic [ref=e101]: (2023)
                  - generic [ref=e102]:
                    - img [ref=e103]
                    - generic [ref=e105]: XYZ-5678
                - img [ref=e107]
              - generic [ref=e110]:
                - button "View Details" [ref=e111]
                - button "Service" [ref=e112]:
                  - img [ref=e113]
                  - text: Service
  - button "Open Next.js Dev Tools" [ref=e120] [cursor=pointer]:
    - img [ref=e121]
  - alert [ref=e124]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Vehicle Management', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Standardized login flow for E2E
  6  |     await page.goto('/login');
  7  |     await page.fill('input[type="email"]', 'admin@fleet.com');
  8  |     await page.fill('input[type="password"]', 'admin123');
  9  |     await page.click('button[type="submit"]');
  10 |     await expect(page).toHaveURL('/dashboard');
  11 |   });
  12 | 
  13 |   test('should register a new vehicle', async ({ page }) => {
  14 |     await page.goto('/vehicles');
> 15 |     await page.click('button:has-text("Register Asset")');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  16 |     
  17 |     await page.fill('input[name="plateNumber"]', 'QA-TEST-' + Date.now().toString().slice(-4));
  18 |     await page.fill('input[name="make"]', 'Tesla');
  19 |     await page.fill('input[name="model"]', 'Model S');
  20 |     await page.fill('input[name="year"]', '2024');
  21 |     await page.fill('input[name="purchaseCost"]', '80000');
  22 |     await page.selectOption('select[name="type"]', 'CAR');
  23 |     
  24 |     await page.click('button:has-text("Finalize Registration")');
  25 |     
  26 |     await expect(page.locator('text=Tesla Model S')).toBeVisible();
  27 |   });
  28 | 
  29 |   test('should filter vehicles by status', async ({ page }) => {
  30 |     await page.goto('/vehicles');
  31 |     await page.click('button:has-text("Filter")');
  32 |     await page.click('text=Available Only');
  33 |     
  34 |     // Verify only available vehicles are shown
  35 |     const statusBadges = page.locator('span:has-text("AVAILABLE")');
  36 |     const count = await statusBadges.count();
  37 |     expect(count).toBeGreaterThan(0);
  38 |     
  39 |     await expect(page.locator('span:has-text("ASSIGNED")')).not.toBeVisible();
  40 |   });
  41 | });
  42 | 
```