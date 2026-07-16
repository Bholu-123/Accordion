const { test, expect } = require('@playwright/test');

test('expands and collapses an FAQ answer', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: /questions and answers\s+about login/i })
  ).toBeVisible();

  const question = page.locator('.question').filter({
    hasText: 'Do I have to allow the use of cookies?',
  });
  const answer = page.getByText(
    /Unicorn vinyl poutine brooklyn, next level direct trade iceland/i
  );

  await expect(question).toBeVisible();
  await question.locator('button').click();
  await expect(answer).toBeVisible();

  await question.locator('button').click();
  await expect(answer).toBeHidden();
});
