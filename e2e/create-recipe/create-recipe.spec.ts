import { test, expect } from '@playwright/test';
import { CreateRecipePage } from './recipe-page';

test.describe('Create Recipe Page', () => {
    test('should load successfully', async ({ page, context }) => {
        // Inject auth cookie to bypass middleware
        await context.addCookies([
            {
                name: 'auth_token',
                value: 'mock-token',
                domain: 'localhost',
                path: '/',
            },
        ]);

        const recipePage = new CreateRecipePage(page);
        await recipePage.goto();
        await recipePage.verifyPageLoaded();
    });
});
