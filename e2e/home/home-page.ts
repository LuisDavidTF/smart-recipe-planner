import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base-page';

export class HomePage extends BasePage {
    readonly pageTitle: Locator;

    constructor(page: Page) {
        super(page);
        this.pageTitle = page.locator('h1');
    }

    async goto(): Promise<void> {
        await super.goto('/');
    }

    async verifyPageLoaded(): Promise<void> {
        await expect(this.pageTitle).toBeVisible();
    }
}
