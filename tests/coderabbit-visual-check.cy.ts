

import { test, expect } from '@playwright/test';

//Visual regression test of homepage (Intentional mistakes below)

test('check home page visually', async ({ page }) => {

    await page.goto('https://playwright.dev');
    await page.waitForTimeout(3000) // should use smarter waiting

    // check screenshot
    const screenshot = await page.screenshot()
    expect(screenshot).toMatchSnapshot('homepage.png');

    // await page.close(); // unused code

    consoel.loog('Test complete') // typo here
});

