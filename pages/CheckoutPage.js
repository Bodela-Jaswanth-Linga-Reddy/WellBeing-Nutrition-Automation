export class CheckoutPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        // The third-party checkout UI runs inside an iframe
        this.checkoutFrame = page.locator('iframe[title="Checkout window"]').contentFrame();
        
        // COD selection
        this.cashOnDeliveryBtn = this.checkoutFrame.getByRole('button', { name: /Cash on Delivery/ });
        this.secondaryCodBtn = this.checkoutFrame.getByRole('button').filter({ hasText: /^$/ }).nth(1);

        // Cancel/Back buttons
        this.backArrowImg = this.checkoutFrame.locator('img').first();
        this.cancelImg = this.checkoutFrame.getByRole('img').first();
        this.confirmYesBtn = this.checkoutFrame.getByRole('button', { name: 'Yes' });
    }

    async selectCashOnDelivery() {
        await this.cashOnDeliveryBtn.waitFor({ state: 'visible', timeout: 15000 });
        await this.cashOnDeliveryBtn.click();
        
        // Wait for secondary options if applicable
        await this.page.waitForTimeout(1000);
        // Fallback or secondary click based on the generated script
        await this.secondaryCodBtn.click();
    }

    async cancelCheckout() {
        // Based on the raw script clicks to close the checkout modal
        await this.backArrowImg.waitFor({ state: 'visible', timeout: 15000 });
        await this.backArrowImg.click();
        await this.page.waitForTimeout(1000);
        
        await this.cancelImg.waitFor({ state: 'visible', timeout: 10000 });
        await this.cancelImg.click();
        await this.page.waitForTimeout(500);
        
        await this.confirmYesBtn.waitFor({ state: 'visible', timeout: 10000 });
        await this.confirmYesBtn.click();
        
        // Wait for checkout iframe to close and cart/homepage to become interactive
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);
    }
}
