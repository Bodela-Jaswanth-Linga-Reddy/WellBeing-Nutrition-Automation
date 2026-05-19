export class LoginPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.kwikpassFrame = page.frameLocator('iframe[id*="kwikpass"], iframe[src*="kwikpass"], iframe[title*="kwikpass"], iframe[name*="kwikpass"]');
        this.phoneInput = this.kwikpassFrame.locator('[id="phone-input"]');
    }
    async enterPhoneNumber(phoneNumber) {
        await this.phoneInput.waitFor({ state: 'visible', timeout: 15000 });
        await this.phoneInput.click();
        await this.phoneInput.fill(phoneNumber);
    }
}
