import { test, expect } from '@playwright/test';

// RegisterPage calls the backend directly at http://localhost:3000/api/register
// (see src/api/auth.ts), so we intercept that call rather than run a real backend -
// this is a frontend-only test of the register form's behavior.
const REGISTER_ENDPOINT = 'http://localhost:3000/api/register';

test.describe('Register', () => {
  test('shows validation errors for empty submission', async ({ page }) => {
    await page.goto('/register');

    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page.getByText('Full name is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('shows a hint for a weak password', async ({ page }) => {
    await page.goto('/register');

    await page.getByLabel('Password', { exact: true }).fill('weak');
    await page.getByLabel('Password', { exact: true }).blur();

    await expect(
      page.getByText('At least 8 characters, include letters and numbers.'),
    ).toBeVisible();
  });

  test('registers successfully and redirects to login', async ({ page }) => {
    await page.route(REGISTER_ENDPOINT, async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'User registered successfully' }),
      });
    });

    await page.goto('/register');

    await page.getByLabel('Full Name').fill('Jane Doe');
    await page.getByLabel('Email').fill('jane.doe@example.com');
    await page.getByLabel('Password', { exact: true }).fill('Password123');
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page.getByText('Registration successful')).toBeVisible();
    await expect(page).toHaveURL('/login', { timeout: 3000 });
  });

  test('shows a modal when the email is already registered', async ({ page }) => {
    await page.route(REGISTER_ENDPOINT, async (route) => {
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'User already exists' }),
      });
    });

    await page.goto('/register');

    await page.getByLabel('Full Name').fill('Jane Doe');
    await page.getByLabel('Email').fill('jane.doe@example.com');
    await page.getByLabel('Password', { exact: true }).fill('Password123');
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page.getByText('Email already registered, please log in instead')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Go to login' })).toBeVisible();
  });
});
