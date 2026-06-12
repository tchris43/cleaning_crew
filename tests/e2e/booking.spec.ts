import { test, expect } from '@playwright/test';

test('happy path booking creates appointment and shows success', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Name').fill('E2E Tester');
  await page.getByLabel('Phone').fill('555-111-2222');
  await page.getByLabel('Email').fill('e2e@example.com');
  await page.getByLabel('Service Tier').selectOption('BASIC_REFRESH');
  await page.getByLabel('Vehicle Make').fill('Honda');
  await page.getByLabel('Vehicle Model').fill('Civic');
  await page.getByLabel('Date').fill('2026-06-15');
  await page.getByLabel('Time').selectOption('09:00');
  await page.getByLabel('Photo permission').check();

  await page.getByRole('button', { name: 'Book Appointment' }).click();

  await expect(page.getByText('Appointment Booked')).toBeVisible({ timeout: 10000 });
});
