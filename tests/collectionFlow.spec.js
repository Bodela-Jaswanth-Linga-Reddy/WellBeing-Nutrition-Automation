import { test, expect } from '@playwright/test';
import { testData } from '../config/common.data.js';
import { HomePage } from '../pages/HomePage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { CollectionPage } from '../pages/CollectionPage.js';
import { CartDrawer } from '../pages/CartDrawer.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';

test.setTimeout(120000); // 2 minutes to allow for manual OTP and the long E2E flow

test('E2E Collection and Checkout Flow after Login', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const collectionPage = new CollectionPage(page);
    const cartDrawer = new CartDrawer(page);
    const checkoutPage = new CheckoutPage(page);

    // ==========================================
    // 1. LOGIN FLOW
    // ==========================================
    await test.step('Navigate and Login', async () => {
        await page.goto(testData.baseUrl);
        await homePage.clickLoginHeader();
        await loginPage.enterPhoneNumber(testData.users.validUser.phone);
        
        // Wait for manual OTP and verify login by checking the profile icon appears
        await homePage.profileIcon.waitFor({ state: 'visible', timeout: 60000 });
    });

    // ==========================================
    // Handle Random Promotional Popups Globally
    // ==========================================
    await test.step('Setup Background Popup Monitor', async () => {
        // We use the exact image URL of the 'X' button you found in DevTools!
        const popupCloseBtn = page.locator('img[src*="32178.png"]');
        
        // This runs in the background. If that 'X' image ever appears on screen, it instantly clicks it.
        await page.addLocatorHandler(popupCloseBtn, async () => {
            console.log('Marketing Popup Detected! Clicking the exact close image...');
            await popupCloseBtn.click();
        });
    });

    // ==========================================
    // 2. COLLECTION FLOW
    // ==========================================
    await test.step('Navigate Carousel and Select Collection', async () => {
        // Since the profile menu is open from the login verification, 
        // we might need to click outside to close it, or just proceed if the banner is clickable.
        // The script goes straight to 'Next' buttons.
        await collectionPage.navigateCarousel();
        await collectionPage.selectCollectionBanner();
    });

    await test.step('Filter, Sort, and view FAQs', async () => {
        await collectionPage.applyFiltersAndSort();
        await collectionPage.interactWithFaqs();
    });

    await test.step('Add product to Wishlist and Cart', async () => {
        await collectionPage.addThirdProductToCart();
    });

    // ==========================================
    // 3. CART DRAWER FLOW
    // ==========================================
    await test.step('Apply Coupon and Adjust Quantity', async () => {
        await cartDrawer.applyCoupon(testData.cart.couponCode);
        await cartDrawer.increaseQuantity();
        await cartDrawer.decreaseQuantity();
    });

    await test.step('Proceed to Checkout', async () => {
        await cartDrawer.proceedToCheckout();
    });

    // ==========================================
    // 4. CHECKOUT FLOW
    // ==========================================
    await test.step('Select COD and Cancel Checkout', async () => {
        await checkoutPage.selectCashOnDelivery();
        await checkoutPage.cancelCheckout();
    });

    await test.step('Return to Homepage', async () => {
        await cartDrawer.backToHomepageFromCart();
    });
});
