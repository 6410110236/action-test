import { test, expect } from '@playwright/test';

test("login with correct credentials", async ({ page, browserName }) => {
  await page.goto('https://w07.pupasoft.com/signin');
  await page.fill('input[name="username"]', 'buyer1');
  if (browserName === 'webkit') {
    await page.fill('input[name="password"]', 'password');
    await page.press('input[name="password"]', 'Enter');
  } else {
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
  }
  console.log('Current URL:', await page.url());
  await expect(page).toHaveURL('https://w07.pupasoft.com/home');
});

test("login with incorrect credentials", async ({ page }) => {
  await page.goto('https://w07.pupasoft.com/signin');
  await page.fill('input[name="username"]', 'buyer1');
  await page.fill('input[name="password"]', 'wrongpassword');
  await page.click('button[type="submit"]');

  const errorMsg = page.locator('div[role="alert"]');

  await expect(errorMsg).toBeVisible();
  await expect(errorMsg).toHaveText('Login failed: Request failed with status code 500');
});