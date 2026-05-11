# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: assignments.spec.ts >> Assignment Lifecycle >> should dispatch and return a vehicle
- Location: e2e/assignments.spec.ts:12:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://localhost:3000/dashboard"
Received: "http://localhost:3000/login"
Timeout:  5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    9 × unexpected value "http://localhost:3000/login"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e6]:
        - link "U UltraDrive" [ref=e7] [cursor=pointer]:
          - /url: /
          - generic [ref=e8]: U
          - generic [ref=e9]: UltraDrive
        - generic [ref=e10]:
          - heading "Welcome Back." [level=1] [ref=e11]
          - paragraph [ref=e12]: Enter your credentials to access the fleet management operations.
        - generic [ref=e13]:
          - generic [ref=e14]:
            - text: Email Address
            - textbox "admin@fleet.com" [ref=e16]
          - generic [ref=e17]:
            - generic [ref=e18]:
              - generic [ref=e19]: Password
              - link "Forgot Password?" [ref=e20] [cursor=pointer]:
                - /url: "#"
            - textbox "••••••••" [ref=e22]: admin123
          - button "Authenticating..." [disabled] [ref=e23]:
            - generic [ref=e24]: Authenticating...
        - paragraph [ref=e26]:
          - text: Don't have access?
          - link "Contact Fleet Admin" [ref=e27] [cursor=pointer]:
            - /url: "#"
      - generic [ref=e29]:
        - img "UltraDrive Fleet Brand" [ref=e30]
        - generic [ref=e33]:
          - generic [ref=e34]:
            - img [ref=e36]
            - heading "Mission Control for Modern Fleets." [level=2] [ref=e38]
          - paragraph [ref=e39]: Join leading logistics companies using UltraDrive to optimize utilization, track history, and scale operations with enterprise-grade security.
          - generic [ref=e40]:
            - generic [ref=e41]:
              - paragraph [ref=e42]: 99.9%
              - paragraph [ref=e43]: Reliability
            - generic [ref=e44]:
              - paragraph [ref=e45]: 12k+
              - paragraph [ref=e46]: Assignments
            - generic [ref=e47]:
              - paragraph [ref=e48]: 24/7
              - paragraph [ref=e49]: Live Support
  - button "Open Next.js Dev Tools" [ref=e55] [cursor=pointer]:
    - img [ref=e56]
  - alert [ref=e59]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Assignment Lifecycle', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/login');
  6  |     await page.fill('input[type="email"]', 'admin@fleet.com');
  7  |     await page.fill('input[type="password"]', 'admin123');
  8  |     await page.click('button[type="submit"]');
> 9  |     await expect(page).toHaveURL('/dashboard');
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  10 |   });
  11 | 
  12 |   test('should dispatch and return a vehicle', async ({ page }) => {
  13 |     await page.goto('/assignments');
  14 |     await page.click('button:has-text("Dispatch Vehicle")');
  15 |     
  16 |     // Select first available vehicle and staff
  17 |     await page.selectOption('select[name="vehicleId"]', { index: 1 });
  18 |     await page.selectOption('select[name="driverId"]', { index: 1 });
  19 |     
  20 |     await page.click('button:has-text("Confirm Dispatch")');
  21 |     
  22 |     // Check if it appears in the list as "In Transit"
  23 |     await expect(page.locator('text=In Transit').first()).toBeVisible();
  24 |     
  25 |     // Perform return
  26 |     await page.click('button:has-text("Mark Returned")');
  27 |     
  28 |     // Verify it marked as "Completed"
  29 |     await expect(page.locator('text=Completed').first()).toBeVisible();
  30 |   });
  31 | });
  32 | 
```