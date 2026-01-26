import { test } from '@playwright/test';
import { HomePage } from './home-page';

test.describe('Home Page', () => {
    test('should load successfully', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await homePage.verifyPageLoaded();
    });
});
