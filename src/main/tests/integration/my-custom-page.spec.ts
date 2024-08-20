import { test, expect } from '@playwright/test';

test('should render a link to custom page', async ({ page, baseURL }) => {
  await page.goto(baseURL);

  await expect(page.getByRole('link', { name: 'My custom page' })).toBeVisible();
});


test('should navigate to the custom page', async ({ page, baseURL }) => {
  await page.goto(baseURL);

  await page.getByRole('link', { name: 'My custom page' }).click();

  expect(page.url()).toBe(`${baseURL}/plugins/servlet/my-custom-page`)

  await expect(page.getByRole('heading', { name: 'My custom page' })).toBeVisible();
});
