export class HomePage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.loginHeaderButton = page.locator('#kp-login-button-header-logo #svgkp');
        this.profileIcon = page.locator('#icon-kwikpass #svgkp');
        this.logoutButton = page.getByRole('button', { name: 'Logout' });
    }
    async clickLoginHeader() {
        await this.loginHeaderButton.waitFor({ state: 'visible' });
        await this.loginHeaderButton.click();
        await this.page.waitForTimeout(1500);
    }
    async openProfileMenu() {
        await this.profileIcon.waitFor({ state: 'visible', timeout: 60000 });
        await this.page.waitForTimeout(2000);
        await this.profileIcon.click();
    }
    async clickLogout() {
        await this.logoutButton.waitFor({ state: 'visible' });
        await this.logoutButton.click();
    }
}
