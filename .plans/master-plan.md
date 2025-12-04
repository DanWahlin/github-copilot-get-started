# Plan: 5-Day Weather Forecast Website

A professional, responsive weather website using **Open-Meteo API** (free, no API key needed) with a modern card-based UI. Built with **HTML, CSS, and Vanilla JavaScript** for simplicity and fast loading, featuring a clean design with weather icons, temperature gradients, and a responsive grid layout.

## Steps

1. **Create project structure** — Set up `index.html`, `styles.css`, and `app.js` files in the workspace root.

2. **Build HTML layout** — Create a search input for city/location, a current weather hero section, and a 5-card forecast grid container.

3. **Style the UI** — Use CSS with a modern color palette, card shadows, responsive flexbox/grid, and weather-appropriate gradients (blues for cold, oranges for warm).

4. **Implement API integration** — Use JavaScript to:
   - Fetch location coordinates via [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
   - Fetch 5-day forecast data from [Open-Meteo Weather API](https://open-meteo.com/en/docs)

5. **Render forecast cards** — Dynamically display day/date, weather icon, high/low temps, and conditions using [Weather Icons](https://erikflowers.github.io/weather-icons/) library.

6. **Add geolocation** — Implement browser geolocation for auto-detecting user location on first load.

## API Details

| API | Endpoint | Purpose |
|-----|----------|---------|
| Open-Meteo Geocoding | `https://geocoding-api.open-meteo.com/v1/search` | Convert city names to lat/lon |
| Open-Meteo Weather | `https://api.open-meteo.com/v1/forecast` | Get daily forecast data |

**Pros of Open-Meteo:**
- ✅ Completely free (no API key required)
- ✅ Up to 16-day forecasts available
- ✅ High-quality data from multiple national weather services
- ✅ No rate limits for personal use

## Design Specifications

### Card Structure
Each forecast card displays:
- Day/Date header (e.g., "Monday, Dec 4")
- Weather icon (prominent, centered)
- High/Low temperatures (bold, differentiated colors)
- Weather condition text (e.g., "Partly Cloudy")
- Secondary info (humidity, precipitation chance)

### Visual Style
| Element | Specification |
|---------|---------------|
| Color Scheme | Blue gradients (cold) → Orange gradients (warm) |
| Typography | Large bold temps, readable secondary text |
| Card Design | Rounded corners, subtle shadows, glassmorphism optional |
| Layout | 5-column grid (desktop), stacked cards (mobile) |
| Responsiveness | Breakpoints at 768px and 480px |

## Features

### MVP (Phase 1) ✅ IMPLEMENTED
- [x] Location search by city name
- [x] Current weather display
- [x] 5-day forecast cards
- [x] Responsive design
- [x] Weather icons
- [x] High/Low temperatures

### Enhancements (Phase 2) ✅ IMPLEMENTED
- [x] Geolocation auto-detect
- [x] °C/°F unit toggle
- [ ] Hourly forecast view
- [ ] Dynamic background based on conditions
- [ ] Loading skeleton states

### Future (Phase 3)
- [ ] Save favorite locations (localStorage)
- [ ] Dark/light mode toggle
- [ ] Weather alerts/warnings
- [ ] PWA support (offline mode)

## File Structure
