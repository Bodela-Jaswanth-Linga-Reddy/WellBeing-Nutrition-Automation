export class CollectionPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        // Navigation
        this.nextButton = page.getByRole('button', { name: 'Next' });
        this.collectionBanner = page.getByRole('link', { name: 'Group_91_1_72db1688-b736-452f' });

        // Filters and Sorting
        this.filterButton = page.getByRole('button', { name: 'Filter' });
        this.availableFilter = page.getByRole('button', { name: 'Available' });
        this.inStockCheckbox = page.getByText('In stock', { exact: true });
        this.sortDropdown = page.getByLabel('Sort');

        // FAQs
        this.knowMoreText = page.locator('#shopify-section-template--15867922481232__collection_faqs_WQf9zL div').filter({ hasText: 'Know More Protein is the' }).nth(1);
        this.knowMoreButton = page.getByRole('button', { name: 'Know More' });
        this.faqSection = page.locator('#faq');
        this.faqWheyProteinButton = page.getByRole('button', { name: 'FAQ - Whey Protein' });

        // Products
        this.thirdProductWishlistBtn = page.locator('div:nth-child(3) > .grid-product__content > .grid__item-image-wrapper > .grid-product__image-mask > .wishlist-toggle-btn');
        this.thirdProductAddToCartBtn = page.locator('div:nth-child(3) > .grid-product__content > .grid__item-image-wrapper > .addtocart_buttonsec > .add-to-cart');
    }

    async navigateCarousel() {
        await this.nextButton.first().click();
        await this.page.waitForTimeout(500);
        await this.nextButton.first().click();
    }

    async selectCollectionBanner() {
        await this.collectionBanner.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async applyFiltersAndSort() {
        await this.filterButton.click();
        await this.availableFilter.click();
        await this.inStockCheckbox.click();
        await this.sortDropdown.selectOption('price-ascending');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async interactWithFaqs() {
        await this.knowMoreText.waitFor({ state: 'visible', timeout: 15000 });
        await this.knowMoreText.click();
        
        await this.knowMoreButton.first().waitFor({ state: 'visible', timeout: 10000 });
        await this.knowMoreButton.first().click();
        await this.page.waitForTimeout(500); // Wait for accordion animation
        
        // The codegen recorded a second click (which closes the accordion). 
        // We use first() again instead of nth(1) because it's the exact same button!
        await this.knowMoreButton.first().click();
        
        await this.faqSection.waitFor({ state: 'visible', timeout: 10000 });
        await this.faqSection.click();
        
        await this.faqWheyProteinButton.first().click();
        await this.page.waitForTimeout(500);
        await this.faqWheyProteinButton.first().click(); // Second click to close
    }

    async addThirdProductToCart() {
        await this.thirdProductWishlistBtn.click();
        await this.thirdProductAddToCartBtn.click();
    }
}
