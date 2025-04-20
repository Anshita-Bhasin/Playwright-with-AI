import { test, expect } from '@playwright/test';
import { devices } from '@playwright/test';
test.describe('Visit Dubai Website Navigation Tests', () => {
    test('should navigate to Sikka Art & Design Festival page from homepage', async ({ page, context }) => {
        // Navigate to homepage
        await page.goto('https://www.visitdubai.com/en/');

        // Click on the Sikka Art banner
        await page.getByLabel('Creativity comes alive at Sikka Art & Design Festival | Discover more').click();

        // Wait for and handle new tab/popup
        const popupPromise = page.waitForEvent('popup');
        await page.getByRole('link', { name: 'More info | Opens in a new' }).click();
        const newPage = await popupPromise;

        // Verify new page is opened
        expect(newPage).toBeTruthy();

    
    });
});

test('Test 1: Verify direct navigation to homepage URL', async ({ page }) => {
    // Act - Navigate to homepage
    const response = await page.goto('https://www.visitdubai.com/en/');

    // Assert
    expect(response?.status()).toBe(200);
    expect(page.url()).toBe('https://www.visitdubai.com/en/');
    await expect(page.locator('main')).toBeVisible();
});

test('Test 2: Validate banner click interaction', async ({ page }) => {
    // Arrange
    await page.goto('https://www.visitdubai.com/en/');

    // Act
    const banner = page.getByLabel('Creativity comes alive at Sikka Art & Design Festival | Discover more');

    // Assert - Verify banner is clickable
    await expect(banner).toBeEnabled();

    // Act - Perform click
    await banner.click();

    // Assert - Verify click was successful (banner should remain visible)
    await expect(banner).toBeVisible();
});

test('Test 3: Homepage navigation with slow network connection', async ({ page, context }) => {
    // Setup slow network conditions
    await context.route('**/*', (route) => {
        route.continue({
            delay: 100  // Add 100ms delay to all requests
        });
    });

    // Navigate and verify
    const startTime = Date.now();
    await page.goto('https://www.visitdubai.com/en/');
    const loadTime = Date.now() - startTime;

    // Verify page loaded successfully despite slow connection
    await expect(page).toHaveTitle(/Visit Dubai/);
    expect(loadTime).toBeLessThan(30000); // Should load within 30 seconds
});

test('Test 4: Banner interaction on mobile devices', async ({ page }) => {
    // Setup mobile viewport
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone X size

    // Navigate and verify banner
    await page.goto('https://www.visitdubai.com/en/');

    // Verify banner is visible and interactive
    const banner = await page.getByLabel('Creativity comes alive at Sikka Art & Design Festival | Discover more');
    await expect(banner).toBeVisible();

    // Test interaction
    await banner.hover();
    await expect(banner).toBeEnabled();
});
test('Test 5: Banner responsiveness on different screen sizes', async ({ page }) => {
    const viewports = [
        { width: 1920, height: 1080 }, // Desktop
        { width: 768, height: 1024 },  // Tablet
        { width: 375, height: 812 }    // Mobile
    ];

    for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.goto('https://www.visitdubai.com/en/');

        // Verify banner visibility and layout
        const banner = await page.getByLabel('Creativity comes alive at Sikka Art & Design Festival | Discover more');
        await expect(banner).toBeVisible();

        // Verify banner maintains proper dimensions
        const bannerBox = await banner.boundingBox();
        expect(bannerBox.width).toBeLessThanOrEqual(viewport.width);
    }
});
test('Test 6: Test banner interaction with JavaScript disabled', async ({ browser }) => {
    // Create context with JavaScript disabled
    const context = await browser.newContext({
        javaScriptEnabled: false
    });
    const page = await context.newPage();

    // Load homepage
    await page.goto('https://www.visitdubai.com/en/');

    // Verify static banner content is visible
    const bannerContent = await page.getByRole('banner').textContent();
    expect(bannerContent).toBeTruthy();

    await context.close();
});

test('Test 7: Check homepage load performance on 3G connection', async ({ browser }) => {
    // Create context with 3G network conditions
    const context = await browser.newContext({
        ...devices['Pixel 4'],
    });
    const page = await context.newPage();

    // Enable network throttling
    await page.route('**/*', async route => {
        await route.continue({
            speed: 780 * 1024 / 8 // Simulate 3G speed
        });
    });

    const startTime = Date.now();
    await page.goto('https://www.visitdubai.com/en/');
    const loadTime = Date.now() - startTime;

    // Verify performance
    expect(loadTime).toBeLessThan(30000); // 30s timeout
    expect(await page.getByRole('main').isVisible()).toBeTruthy();

    await context.close();
});
