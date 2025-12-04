# WeatherView - Copilot Instructions

## Project Overview
A 5-day weather forecast website using vanilla HTML/CSS/JavaScript with the Open-Meteo API (free, no API key required). Dark theme with glassmorphism design and responsive card-based layout.

## Architecture

### File Structure
- `index.html` - Single-page app structure with search, current weather hero, and forecast cards
- `styles.css` - CSS variables, glassmorphism effects, responsive breakpoints (768px, 480px)
- `app.js` - All application logic: API calls, state management, DOM rendering
- `tests/weather.spec.js` - Playwright E2E tests with screenshot capture
- `.plans/master-plan.md` - Feature roadmap and design specifications

### Data Flow
1. User searches city → `geocodeCity()` calls Open-Meteo Geocoding API → returns lat/lon
2. Coordinates → `fetchWeather()` calls Open-Meteo Weather API → returns forecast data
3. Data stored in `currentWeatherData` state → `renderCurrentWeather()` and `renderForecastCards()` update DOM

### Key Patterns
- **State variables**: `currentUnit`, `currentWeatherData`, `currentLocation` manage app state
- **Weather codes**: `weatherCodes` object maps WMO codes to descriptions and Weather Icons classes (e.g., `wi-day-sunny`)
- **UI states**: Toggle visibility with `.hidden` class via `showElement()`/`hideElement()` helpers
- **Temperature conversion**: `getTemperature()` respects `currentUnit` ('celsius' | 'fahrenheit')

## Development Commands

```bash
# Start local server (required for testing)
python3 -m http.server 8080

# Run all Playwright tests
npm test

# Run tests with visible browser
npm run test:headed

# Open Playwright UI mode
npm run test:ui

# View test report
npm run test:report
```

## Testing Conventions
- Tests use Playwright with auto-starting web server (configured in `playwright.config.js`)
- City weather tests (Seattle, Phoenix, NYC) save screenshots to `tests/screenshots/`
- Use `{ timeout: 10000 }` for API-dependent assertions
- Test pattern: fill input → click search → wait for `#main-content` visible → assert content

## CSS Conventions
- Use CSS variables from `:root` (e.g., `--bg-card`, `--text-primary`, `--radius-lg`)
- Always include `-webkit-backdrop-filter` alongside `backdrop-filter` for Safari
- Temperature color classes: `.temp-cold`, `.temp-warm`, `.temp-hot`

## API Reference
| Endpoint | Usage |
|----------|-------|
| `https://geocoding-api.open-meteo.com/v1/search?name={city}` | City → coordinates |
| `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&...` | Coordinates → weather |

Default unit is Fahrenheit. Weather Icons CDN provides icon classes (`wi-*`).
