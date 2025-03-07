// tests/SellUsers.spec.js
import { test, expect } from '@playwright/test';

test.describe('Sell User Page - Delete Car', () => {
  test.beforeEach(async ({ page, browserName }) => {
    await page.goto('http://localhost:3000/signin');
    await page.fill('input[name="username"]', 'seller1');
    await page.fill('input[name="password"]', 'password');

    if (browserName === 'webkit') {
      await page.press('input[name="password"]', 'Enter');
    } else {
      await page.click('button[type="submit"]');
    }
    await page.waitForURL('http://localhost:3000/home', { waitUntil: 'networkidle' });

    await page.goto('http://localhost:3000/selluser');
    await expect(page).toHaveURL('http://localhost:3000/selluser');

    // Delete all cars before each test
    await deleteAllCars(page);
  });

  async function deleteAllCars(page) {
    let deleteButtons = await page.$$('button:has-text("Delete")');
    while (deleteButtons.length > 0) {
      await deleteButtons[0].click();
      await expect(page.getByText("Confirm Delete")).toBeVisible();
      await page.getByRole('button', { name: 'Delete' }).click();

      await page.waitForFunction(() => {
        const currentCarItems = document.querySelectorAll('.car-item');
        return currentCarItems.length === 0;
      },{timeout:5000});
      
      deleteButtons = await page.$$('button:has-text("Delete")');
    }
  }

  test('should delete a car when confirm delete', async ({ page }) => {
    await addCar(page);
    await addCar(page);
    const deleteButtons = await page.$$('button:has-text("Delete")');
    expect(deleteButtons.length).toBeGreaterThan(0); 

    const initialCarItems = await page.$$('.car-item');
    const initialCarCount = initialCarItems.length;

 
    await deleteButtons[0].click();

   
    await expect(page.getByText("Confirm Delete")).toBeVisible();
    await page.getByRole('button', { name: 'Delete' }).click(); 

   
    await page.waitForFunction(
      (initialCarCount) => {
        const currentCarItems = document.querySelectorAll('.car-item');
        return currentCarItems.length === initialCarCount - 1;
      },
      initialCarCount,
      { timeout: 5000 }
    );


    const finalCarItems = await page.$$('.car-item'); 
    const finalCarCount = finalCarItems.length;

    expect(finalCarCount).toBe(initialCarCount - 1); 
  });

  test('should not delete a car when cancel delete', async ({ page }) => {
    await addCar(page);


    const deleteButtons = await page.$$('button:has-text("Delete")');
    expect(deleteButtons.length).toBeGreaterThan(0); 
    const initialCarItems = await page.$$('.car-item');
    const initialCarCount = initialCarItems.length;


    await deleteButtons[0].click();


    await expect(page.getByText("Confirm Delete")).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click(); 


    await page.waitForFunction(
      (initialCarCount) => {
        const currentCarItems = document.querySelectorAll('.car-item');
        return currentCarItems.length === initialCarCount;
      },
      initialCarCount,
      { timeout: 5000 }
    );

    const finalCarItems = await page.$$('.car-item'); 
    const finalCarCount = finalCarItems.length;
    expect(finalCarCount).toBe(initialCarCount);
  });
});

async function addCar(page) {
  await page.goto('http://localhost:3000/seller');
  await page.click('text=Add');
  await expect(page).toHaveURL('http://localhost:3000/seller/add');
  await page.click('div[role="button"]:has-text("Select brand")');
  await page.click('li:has-text("Toyota")');
  await page.click('div[role="button"]:has-text("Select model")');
  await page.click('li:has-text("Camry")');
  await page.fill('input[name="Price"]', '10000');
  await page.click('button:has-text("Submit")');
  await expect(page).toHaveURL('http://localhost:3000/selluser');
}

