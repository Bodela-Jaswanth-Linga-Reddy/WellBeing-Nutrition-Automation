import { test, expect } from '@playwright/test';
import { testData } from '../config/common.data.js';
import { HomePage } from '../pages/HomePage.js';
import { LoginPage } from '../pages/LoginPage.js';

test.setTimeout(90000);
test('User can login with phone number and manual OTP', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    await test.step('Navigate to the application', async () => {
        await page.goto(testData.baseUrl);
    });
    await test.step('Click on the login header button', async () => {
        await homePage.clickLoginHeader();
    });
    await test.step('Enter phone number', async () => {
        await loginPage.enterPhoneNumber(testData.users.validUser.phone);
    });
    await test.step('Wait for manual OTP, verify login, and open profile menu', async () => {
        await homePage.openProfileMenu();
        await expect(homePage.logoutButton).toBeVisible();
    });
    await test.step('Logout', async () => {
        await homePage.clickLogout();
    });
});
