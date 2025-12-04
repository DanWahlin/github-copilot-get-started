// ===== API Configuration =====
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

// ===== DOM Elements =====
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');
const celsiusBtn = document.getElementById('celsius-btn');
const fahrenheitBtn = document.getElementById('fahrenheit-btn');
const retryBtn = document.getElementById('retry-btn');

const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const errorMessage = document.getElementById('error-message');
const mainContent = document.getElementById('main-content');
const welcomeEl = document.getElementById('welcome');

const locationName = document.getElementById('location-name');
const currentDate = document.getElementById('current-date');
const currentIcon = document.getElementById('current-icon');
const currentTempValue = document.getElementById('current-temp-value');
const currentCondition = document.getElementById('current-condition');
const currentHumidity = document.getElementById('current-humidity');
const currentWind = document.getElementById('current-wind');
const currentPrecip = document.getElementById('current-precip');
const currentPressure = document.getElementById('current-pressure');
const forecastCards = document.getElementById('forecast-cards');

// ===== State =====
let currentUnit = 'fahrenheit';
let currentWeatherData = null;
let currentLocation = null;

// ===== Weather Code Mapping =====
const weatherCodes = {
    0: { description: 'Clear sky', icon: 'wi-day-sunny' },
    1: { description: 'Mainly clear', icon: 'wi-day-sunny-overcast' },
    2: { description: 'Partly cloudy', icon: 'wi-day-cloudy' },
    3: { description: 'Overcast', icon: 'wi-cloudy' },
    45: { description: 'Fog', icon: 'wi-fog' },
    48: { description: 'Depositing rime fog', icon: 'wi-fog' },
    51: { description: 'Light drizzle', icon: 'wi-sprinkle' },
    53: { description: 'Moderate drizzle', icon: 'wi-sprinkle' },
    55: { description: 'Dense drizzle', icon: 'wi-sprinkle' },
    56: { description: 'Light freezing drizzle', icon: 'wi-sleet' },
    57: { description: 'Dense freezing drizzle', icon: 'wi-sleet' },
    61: { description: 'Slight rain', icon: 'wi-rain' },
    63: { description: 'Moderate rain', icon: 'wi-rain' },
    65: { description: 'Heavy rain', icon: 'wi-rain-wind' },
    66: { description: 'Light freezing rain', icon: 'wi-rain-mix' },
    67: { description: 'Heavy freezing rain', icon: 'wi-rain-mix' },
    71: { description: 'Slight snow', icon: 'wi-snow' },
    73: { description: 'Moderate snow', icon: 'wi-snow' },
    75: { description: 'Heavy snow', icon: 'wi-snow-wind' },
    77: { description: 'Snow grains', icon: 'wi-snow' },
    80: { description: 'Slight rain showers', icon: 'wi-showers' },
    81: { description: 'Moderate rain showers', icon: 'wi-showers' },
    82: { description: 'Violent rain showers', icon: 'wi-storm-showers' },
    85: { description: 'Slight snow showers', icon: 'wi-snow' },
    86: { description: 'Heavy snow showers', icon: 'wi-snow-wind' },
    95: { description: 'Thunderstorm', icon: 'wi-thunderstorm' },
    96: { description: 'Thunderstorm with slight hail', icon: 'wi-storm-showers' },
    99: { description: 'Thunderstorm with heavy hail', icon: 'wi-storm-showers' }
};

// ===== Utility Functions =====
function showElement(el) {
    el.classList.remove('hidden');
}

function hideElement(el) {
    el.classList.add('hidden');
}

function showLoading() {
    hideElement(welcomeEl);
    hideElement(errorEl);
    hideElement(mainContent);
    showElement(loadingEl);
}

function showError(message) {
    hideElement(loadingEl);
    hideElement(mainContent);
    hideElement(welcomeEl);
    errorMessage.textContent = message;
    showElement(errorEl);
}

function showContent() {
    hideElement(loadingEl);
    hideElement(errorEl);
    hideElement(welcomeEl);
    showElement(mainContent);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
    });
}

function formatShortDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
    });
}

function getDayName(dateString, index) {
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function celsiusToFahrenheit(celsius) {
    return Math.round((celsius * 9/5) + 32);
}

function getTemperature(celsius) {
    if (currentUnit === 'fahrenheit') {
        return celsiusToFahrenheit(celsius);
    }
    return Math.round(celsius);
}

function getWindSpeed(kmh) {
    if (currentUnit === 'fahrenheit') {
        return Math.round(kmh * 0.621371) + ' mph';
    }
    return Math.round(kmh) + ' km/h';
}

function getWeatherInfo(code) {
    return weatherCodes[code] || { description: 'Unknown', icon: 'wi-na' };
}

// ===== API Functions =====
async function geocodeCity(city) {
    const response = await fetch(
        `${GEOCODING_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    );
    
    if (!response.ok) {
        throw new Error('Failed to geocode city');
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
        throw new Error('City not found. Please try another search.');
    }
    
    return data.results[0];
}

async function fetchWeather(latitude, longitude) {
    const params = new URLSearchParams({
        latitude: latitude,
        longitude: longitude,
        current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation,surface_pressure',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max',
        timezone: 'auto',
        forecast_days: 6
    });
    
    const response = await fetch(`${WEATHER_API}?${params}`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch weather data');
    }
    
    return await response.json();
}

// ===== Render Functions =====
function renderCurrentWeather(data, location) {
    const current = data.current;
    const today = data.daily;
    const weatherInfo = getWeatherInfo(current.weather_code);
    
    // Location and date
    const cityName = location.name;
    const region = location.admin1 || '';
    const country = location.country || '';
    locationName.textContent = [cityName, region, country].filter(Boolean).join(', ');
    currentDate.textContent = formatDate(today.time[0]);
    
    // Current conditions
    currentIcon.className = `wi ${weatherInfo.icon} current-icon`;
    currentTempValue.textContent = getTemperature(current.temperature_2m);
    currentCondition.textContent = weatherInfo.description;
    
    // Details
    currentHumidity.textContent = `${current.relative_humidity_2m}%`;
    currentWind.textContent = getWindSpeed(current.wind_speed_10m);
    currentPrecip.textContent = `${current.precipitation} mm`;
    currentPressure.textContent = `${Math.round(current.surface_pressure)} hPa`;
}

function renderForecastCards(data) {
    const daily = data.daily;
    forecastCards.innerHTML = '';
    
    // Show 5 days (skip today if you want, or include it)
    for (let i = 0; i < 5; i++) {
        const weatherInfo = getWeatherInfo(daily.weather_code[i]);
        const highTemp = getTemperature(daily.temperature_2m_max[i]);
        const lowTemp = getTemperature(daily.temperature_2m_min[i]);
        
        const card = document.createElement('div');
        card.className = `forecast-card${i === 0 ? ' today' : ''}`;
        
        card.innerHTML = `
            <div class="card-day">${getDayName(daily.time[i], i)}</div>
            <div class="card-date">${formatShortDate(daily.time[i])}</div>
            <i class="wi ${weatherInfo.icon} card-icon"></i>
            <div class="card-temps">
                <span class="temp-high">${highTemp}°</span>
                <span class="temp-low">${lowTemp}°</span>
            </div>
            <div class="card-condition">${weatherInfo.description}</div>
            <div class="card-details">
                <div class="card-detail">
                    <i class="wi wi-raindrop"></i>
                    <span>${daily.precipitation_probability_max[i]}%</span>
                </div>
                <div class="card-detail">
                    <i class="wi wi-strong-wind"></i>
                    <span>${getWindSpeed(daily.wind_speed_10m_max[i])}</span>
                </div>
            </div>
        `;
        
        forecastCards.appendChild(card);
    }
}

function updateDisplay() {
    if (currentWeatherData && currentLocation) {
        renderCurrentWeather(currentWeatherData, currentLocation);
        renderForecastCards(currentWeatherData);
    }
}

// ===== Event Handlers =====
async function handleSearch() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    
    showLoading();
    
    try {
        const location = await geocodeCity(city);
        currentLocation = location;
        
        const weatherData = await fetchWeather(location.latitude, location.longitude);
        currentWeatherData = weatherData;
        
        renderCurrentWeather(weatherData, location);
        renderForecastCards(weatherData);
        
        showContent();
    } catch (error) {
        console.error('Error fetching weather:', error);
        showError(error.message || 'Failed to fetch weather data. Please try again.');
    }
}

async function handleGeolocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }
    
    showLoading();
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                
                // Reverse geocode to get location name
                const response = await fetch(
                    `${GEOCODING_API}?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`
                );
                
                // Use a fallback location object if reverse geocoding doesn't return results
                let location = {
                    name: 'Your Location',
                    latitude: latitude,
                    longitude: longitude
                };
                
                if (response.ok) {
                    const geoData = await response.json();
                    if (geoData.results && geoData.results.length > 0) {
                        location = geoData.results[0];
                    }
                }
                
                currentLocation = location;
                
                const weatherData = await fetchWeather(latitude, longitude);
                currentWeatherData = weatherData;
                
                renderCurrentWeather(weatherData, location);
                renderForecastCards(weatherData);
                
                showContent();
            } catch (error) {
                console.error('Error fetching weather:', error);
                showError('Failed to fetch weather data. Please try again.');
            }
        },
        (error) => {
            console.error('Geolocation error:', error);
            let message = 'Unable to get your location';
            
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    message = 'Location access denied. Please enable location permissions.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    message = 'Location information unavailable.';
                    break;
                case error.TIMEOUT:
                    message = 'Location request timed out.';
                    break;
            }
            
            showError(message);
        },
        {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
        }
    );
}

function handleUnitToggle(unit) {
    if (currentUnit === unit) return;
    
    currentUnit = unit;
    
    if (unit === 'celsius') {
        celsiusBtn.classList.add('active');
        fahrenheitBtn.classList.remove('active');
    } else {
        fahrenheitBtn.classList.add('active');
        celsiusBtn.classList.remove('active');
    }
    
    updateDisplay();
}

// ===== Event Listeners =====
searchBtn.addEventListener('click', handleSearch);

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

locationBtn.addEventListener('click', handleGeolocation);

celsiusBtn.addEventListener('click', () => handleUnitToggle('celsius'));
fahrenheitBtn.addEventListener('click', () => handleUnitToggle('fahrenheit'));

retryBtn.addEventListener('click', () => {
    if (currentLocation) {
        cityInput.value = currentLocation.name || '';
        handleSearch();
    } else {
        hideElement(errorEl);
        showElement(welcomeEl);
    }
});

// ===== Initialize =====
// Optionally, auto-detect location on load
// Uncomment the following line to enable auto-geolocation:
// handleGeolocation();
