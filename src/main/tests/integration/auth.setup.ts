import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/login`);

    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('admin');
    await page.getByRole('button', { name: 'Log in' }).click();

    // Wait for the final URL to ensure that the cookies are actually set.
    await page.waitForURL(`${baseURL}/dashboard`);

    // End of authentication steps.

    await page.context().storageState({ path: authFile });
});
