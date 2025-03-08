import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page, browserName }) => {
    await page.goto('https://w07.pupasoft.com/signin');
    await page.fill('input[name="username"]', 'buyer1');
    await page.fill('input[name="password"]', 'password');

    if (browserName === 'webkit') {
        await page.press('input[name="password"]', 'Enter');
        await page.waitForTimeout(5000);
    } else {
        await page.click('button[type="submit"]');
        await page.waitForTimeout(5000);
    }
    await page.goto('https://w07.pupasoft.com/home');
    await expect(page).toHaveURL('https://w07.pupasoft.com/home');
});

test("navigate to user page", async ({ page }) => {
    await page.goto('https://w07.pupasoft.com/user');
    await expect(page).toHaveURL('https://w07.pupasoft.com/user');
});

test("navigate to home page", async ({ page }) => {
    await expect(page).toHaveURL('https://w07.pupasoft.com/home');
});

test("navigate to product page", async ({ page }) => {
    await page.goto('https://w07.pupasoft.com/detail/ycv2q1bc41uchjqpab81vcbd');
    await expect(page).toHaveURL('https://w07.pupasoft.com/detail/ycv2q1bc41uchjqpab81vcbd');
});