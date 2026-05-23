export class CartDrawer {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        // Coupon Code
        this.couponCodeInput = page.getByRole('textbox', { name: 'Enter Coupon Code' });
        this.applyCouponBtn = page.getByRole('button', { name: 'Apply' });

        // Quantity Adjustments (Inside shadow DOM, handled natively by Playwright)
        this.shadowContainer = page.locator('shadow-dom-container');
        this.increaseQtyBtn = this.shadowContainer.getByText('+');
        this.decreaseQtyBtn = this.shadowContainer.getByText('-', { exact: true });
        
        // Checkout Button
        this.checkoutBtn = page.getByRole('button', { name: 'CHECKOUT' });

        // Navigation back
        this.openCartBtn = page.getByLabel('Open cart');
        this.closeIconPath = page.locator('.iconify > path').first();
        // Added .first() to prevent the strict mode violation (8 images found)
        this.shadowImg = this.shadowContainer.getByRole('img').first();
        this.homepageLink = page.getByRole('link', { name: 'Homepage' });
    }

    async applyCoupon(code) {
        await this.couponCodeInput.waitFor({ state: 'visible', timeout: 15000 });
        await this.couponCodeInput.click();
        await this.couponCodeInput.fill(code);
        await this.applyCouponBtn.click();
        
        // Applying a coupon usually triggers an API call and recalculates the total
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(4000); // Increased wait after applying cart coupon
    }

    async increaseQuantity() {
        await this.increaseQtyBtn.waitFor({ state: 'visible', timeout: 15000 });
        await this.increaseQtyBtn.click();
        
        // Wait for cart API update
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000); 
    }

    async decreaseQuantity() {
        await this.decreaseQtyBtn.waitFor({ state: 'visible', timeout: 15000 });
        await this.decreaseQtyBtn.click();
        
        // Wait for cart API update
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);
    }

    async proceedToCheckout() {
        await this.checkoutBtn.waitFor({ state: 'visible', timeout: 15000 });
        await this.checkoutBtn.click();
        
        // Wait for the third-party checkout to load
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(3000);
    }

    async backToHomepageFromCart() {
        // Actions performed at the very end of the script to return home
        await this.openCartBtn.waitFor({ state: 'visible', timeout: 15000 });
        await this.openCartBtn.click();
        await this.page.waitForTimeout(2000); // Wait for cart slide
        
        await this.closeIconPath.click();
        await this.page.waitForTimeout(1000);
        
        await this.shadowImg.click();
        await this.homepageLink.waitFor({ state: 'visible', timeout: 10000 });
        await this.homepageLink.click();
        
        await this.page.waitForLoadState('domcontentloaded');
        
        // Final wait to ensure the homepage is fully visible before the test ends and the browser closes
        await this.page.waitForTimeout(4000);
    }
}
