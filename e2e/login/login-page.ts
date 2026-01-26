import { BasePage } from '../base-page';
import { Page, Locator, expect } from '@playwright/test';

export class LoginPage extends BasePage {
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;
    readonly loginTitle: Locator;

    constructor(page: Page) {
        super(page);
        // Based on inspection of AuthForm and FormInput
        // FormInput uses label with htmlFor matching id.
        // AuthForm ids: email, password
        this.emailInput = page.getByLabel('Email');
        this.passwordInput = page.getByLabel('Contraseña');
        this.submitButton = page.getByRole('button', { name: 'Acceder' });
        this.loginTitle = page.getByRole('heading', { name: 'Acceder', level: 2 });
    }

    async goto(): Promise<void> {
        await super.goto('/login');
    }

    async login(email: string, pass: string): Promise<void> {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(pass);
        await this.submitButton.click();
    }
}
