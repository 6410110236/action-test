import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page, browserName }) => {
    await page.goto('http://localhost:3000/signin');
    await page.fill('input[name="username"]', 'seller1');
    await page.fill('input[name="password"]', 'password');

    if (browserName === 'webkit') {
        await page.press('input[name="password"]', 'Enter');
        await page.waitForTimeout(5000);
    } else {
        await page.click('button[type="submit"]');
        await page.waitForTimeout(5000);
    }
    await page.goto('http://localhost:3000/home');
    await expect(page).toHaveURL('http://localhost:3000/home');
});

test("navigate to seller page", async ({ page }) => {
    await page.goto('http://localhost:3000/seller');
    await expect(page).toHaveURL('http://localhost:3000/seller');
});

test("navigate to home page", async ({ page }) => {
    await expect(page).toHaveURL('http://localhost:3000/home');
});

