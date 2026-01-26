import { BasePage } from '../base-page';
import { Page, Locator, expect } from '@playwright/test';

export class CreateRecipePage extends BasePage {
    readonly pageTitle: Locator;
    readonly nameInput: Locator;
    readonly descriptionInput: Locator;

    constructor(page: Page) {
        super(page);
        // Selectors based on SettingsContext (es)
        this.pageTitle = page.getByRole('heading', { name: 'Nueva Receta', level: 2 });
        this.nameInput = page.getByLabel('Nombre de la receta');
        // Description uses a raw label + textarea, not FormInput, but the label text is 'Descripción'
        this.descriptionInput = page.getByLabel('Descripción');
    }

    async goto(): Promise<void> {
        await super.goto('/create-recipe');
    }

    async verifyPageLoaded(): Promise<void> {
        await expect(this.pageTitle).toBeVisible();
        await expect(this.nameInput).toBeVisible();
    }
}
