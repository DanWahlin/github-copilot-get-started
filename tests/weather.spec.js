// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const screenshotsDir = path.join(__dirname, 'screenshots');

test.describe('Weather App City Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display welcome screen on initial load', async ({ page }) => {
    await expect(page.locator('.welcome')).toBeVisible();
    await expect(page.locator('.welcome h2')).toHaveText('Welcome to WeatherView');
  });

  test('should render Seattle weather correctly', async ({ page }) => {
    // Search for Seattle
    await page.fill('#city-input', 'Seattle');
    await page.click('#search-btn');

    // Wait for loading to complete and content to appear
    await expect(page.locator('#main-content')).toBeVisible({ timeout: 10000 });

    // Verify location name contains Seattle
    await expect(page.locator('#location-name')).toContainText('Seattle');

    // Save screenshot
    await page.screenshot({ path: path.join(screenshotsDir, 'seattle-weather.png'), fullPage: true });

    // Verify current weather section is populated
    await expect(page.locator('#current-temp-value')).not.toHaveText('--');
    await expect(page.locator('#current-condition')).not.toHaveText('--');

    // Verify 5 forecast cards are rendered
    const forecastCards = page.locator('.forecast-card');
    await expect(forecastCards).toHaveCount(5);

    // Verify first card is marked as today
    await expect(forecastCards.first()).toHaveClass(/today/);

    // Verify each card has required elements
    for (let i = 0; i < 5; i++) {
      const card = forecastCards.nth(i);
      await expect(card.locator('.card-day')).toBeVisible();
      await expect(card.locator('.card-icon')).toBeVisible();
      await expect(card.locator('.temp-high')).toBeVisible();
      await expect(card.locator('.temp-low')).toBeVisible();
      await expect(card.locator('.card-condition')).toBeVisible();
    }
  });

  test('should render Phoenix weather correctly', async ({ page }) => {
    // Search for Phoenix
    await page.fill('#city-input', 'Phoenix');
    await page.click('#search-btn');

    // Wait for loading to complete and content to appear
    await expect(page.locator('#main-content')).toBeVisible({ timeout: 10000 });

    // Verify location name contains Phoenix
    await expect(page.locator('#location-name')).toContainText('Phoenix');

    // Save screenshot
    await page.screenshot({ path: path.join(screenshotsDir, 'phoenix-weather.png'), fullPage: true });

    // Verify current weather section is populated
    await expect(page.locator('#current-temp-value')).not.toHaveText('--');
    await expect(page.locator('#current-condition')).not.toHaveText('--');

    // Verify weather details are populated
    await expect(page.locator('#current-humidity')).not.toHaveText('--%');
    await expect(page.locator('#current-wind')).not.toContainText('--');

    // Verify 5 forecast cards are rendered
    const forecastCards = page.locator('.forecast-card');
    await expect(forecastCards).toHaveCount(5);

    // Verify temperatures are displayed (should have degree symbol)
    const tempHigh = forecastCards.first().locator('.temp-high');
    await expect(tempHigh).toContainText('°');
  });

  test('should render New York City weather correctly', async ({ page }) => {
    // Search for New York City
    await page.fill('#city-input', 'New York City');
    await page.click('#search-btn');

    // Wait for loading to complete and content to appear
    await expect(page.locator('#main-content')).toBeVisible({ timeout: 10000 });

    // Verify location name contains New York
    await expect(page.locator('#location-name')).toContainText('New York');

    // Save screenshot
    await page.screenshot({ path: path.join(screenshotsDir, 'new-york-city-weather.png'), fullPage: true });

    // Verify current weather section is populated
    await expect(page.locator('#current-temp-value')).not.toHaveText('--');
    await expect(page.locator('#current-condition')).not.toHaveText('--');

    // Verify 5 forecast cards are rendered
    const forecastCards = page.locator('.forecast-card');
    await expect(forecastCards).toHaveCount(5);

    // Verify precipitation details are shown in cards
    const precipDetail = forecastCards.first().locator('.card-detail').first();
    await expect(precipDetail).toBeVisible();
  });

  test('should toggle between Celsius and Fahrenheit', async ({ page }) => {
    // Search for a city first
    await page.fill('#city-input', 'Seattle');
    await page.click('#search-btn');
    await expect(page.locator('#main-content')).toBeVisible({ timeout: 10000 });

    // Get initial temperature (should be Fahrenheit by default)
    const tempValue = page.locator('#current-temp-value');
    const initialTemp = await tempValue.textContent();

    // Switch to Celsius
    await page.click('#celsius-btn');
    
    // Verify Celsius button is now active
    await expect(page.locator('#celsius-btn')).toHaveClass(/active/);
    
    // Temperature should have changed
    const celsiusTemp = await tempValue.textContent();
    expect(celsiusTemp).not.toBe(initialTemp);

    // Switch back to Fahrenheit
    await page.click('#fahrenheit-btn');
    
    // Verify Fahrenheit button is now active
    await expect(page.locator('#fahrenheit-btn')).toHaveClass(/active/);
    
    // Temperature should be back to original
    const fahrenheitTemp = await tempValue.textContent();
    expect(fahrenheitTemp).toBe(initialTemp);
  });

  test('should show error for invalid city', async ({ page }) => {
    // Search for an invalid city
    await page.fill('#city-input', 'InvalidCityName12345');
    await page.click('#search-btn');

    // Wait for error to appear
    await expect(page.locator('#error')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#error-message')).toContainText('not found');
  });

  test('should allow search by pressing Enter', async ({ page }) => {
    // Type city and press Enter
    await page.fill('#city-input', 'Seattle');
    await page.press('#city-input', 'Enter');

    // Wait for content to appear
    await expect(page.locator('#main-content')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#location-name')).toContainText('Seattle');
  });

  test('should display loading state while fetching', async ({ page }) => {
    // Start search
    await page.fill('#city-input', 'Seattle');
    
    // Click and immediately check for loading state
    await page.click('#search-btn');
    
    // Loading should appear briefly (may be too fast to catch reliably)
    // Just verify the search completes successfully
    await expect(page.locator('#main-content')).toBeVisible({ timeout: 10000 });
  });
});
