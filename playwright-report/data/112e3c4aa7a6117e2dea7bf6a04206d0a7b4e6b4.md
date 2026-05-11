# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication Flow >> should show error for invalid credentials
- Location: e2e/auth.spec.ts:20:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('p.text-red-400')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('p.text-red-400')

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
            - textbox "admin@fleet.com" [ref=e16]: wrong@fleet.com
          - generic [ref=e17]:
            - generic [ref=e18]:
              - generic [ref=e19]: Password
              - link "Forgot Password?" [ref=e20] [cursor=pointer]:
                - /url: "#"
            - textbox "••••••••" [ref=e22]: wrongpass
          - generic [ref=e23]:
            - img [ref=e24]
            - text: Invalid email or password
          - button "Sign Into Dashboard" [ref=e26]:
            - generic [ref=e27]:
              - img [ref=e28]
              - text: Sign Into Dashboard
        - paragraph [ref=e30]:
          - text: Don't have access?
          - link "Contact Fleet Admin" [ref=e31] [cursor=pointer]:
            - /url: "#"
      - generic [ref=e33]:
        - img "UltraDrive Fleet Brand" [ref=e34]
        - generic [ref=e37]:
          - generic [ref=e38]:
            - img [ref=e40]
            - heading "Mission Control for Modern Fleets." [level=2] [ref=e42]
          - paragraph [ref=e43]: Join leading logistics companies using UltraDrive to optimize utilization, track history, and scale operations with enterprise-grade security.
          - generic [ref=e44]:
            - generic [ref=e45]:
              - paragraph [ref=e46]: 99.9%
              - paragraph [ref=e47]: Reliability
            - generic [ref=e48]:
              - paragraph [ref=e49]: 12k+
              - paragraph [ref=e50]: Assignments
            - generic [ref=e51]:
              - paragraph [ref=e52]: 24/7
              - paragraph [ref=e53]: Live Support
  - button "Open Next.js Dev Tools" [ref=e59] [cursor=pointer]:
    - img [ref=e60]
  - alert [ref=e63]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Authentication Flow', () => {
  4  |   test('should login successfully with valid credentials', async ({ page }) => {
  5  |     // Navigate to login page
  6  |     await page.goto('/login');
  7  | 
  8  |     // Fill in credentials
  9  |     await page.fill('input[type="email"]', 'admin@fleet.com');
  10 |     await page.fill('input[type="password"]', 'admin123');
  11 | 
  12 |     // Submit form
  13 |     await page.click('button[type="submit"]');
  14 | 
  15 |     // Should redirect to dashboard
  16 |     await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
  17 |     await expect(page.getByRole('heading', { name: 'Operational Overview' })).toBeVisible({ timeout: 10000 });
  18 |   });
  19 | 
  20 |   test('should show error for invalid credentials', async ({ page }) => {
  21 |     await page.goto('/login');
  22 |     await page.fill('input[type="email"]', 'wrong@fleet.com');
  23 |     await page.fill('input[type="password"]', 'wrongpass');
  24 |     await page.click('button[type="submit"]');
  25 | 
> 26 |     await expect(page.locator('p.text-red-400')).toBeVisible();
     |                                                  ^ Error: expect(locator).toBeVisible() failed
  27 |     await expect(page.locator('p.text-red-400')).toContainText('Invalid email or password');
  28 |   });
  29 | });
  30 | 
```