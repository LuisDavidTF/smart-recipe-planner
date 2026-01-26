import { Page } from '@playwright/test';

export class BasePage {
    constructor(protected page: Page) { }

    async goto(path: string): Promise<void> {
        await this.page.goto(path);
        // Wait for network to be idle to ensure initial data load
        try {
            await this.page.waitForLoadState("networkidle", { timeout: 10000 });
        } catch {
            // Ignore timeout, proceed
        }
    }
}
