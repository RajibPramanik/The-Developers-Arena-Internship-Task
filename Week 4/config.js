// WeatherFlow Configuration - With Your API Key
const CONFIG = {
    WEATHER_API: {
        BASE_URL: 'https://api.openweathermap.org/data/2.5',
        API_KEY: '6938350e5c6e7ebee26f5f459369a816', // ✅ Your actual API key
        UNITS: 'metric',
        LANG: 'en'
    },
    
    FALLBACK_DATA: {
        city: 'London',
        lat: 51.5074,
        lon: -0.1278
    },
    
    SETTINGS: {
        DEFAULT_CITY: 'London',
        UPDATE_INTERVAL: 300000,
        CACHE_DURATION: 600000,
        MAX_SEARCH_HISTORY: 5
    },
    
    WEATHER_ICONS: {
        '01d': 'fas fa-sun',
        '01n': 'fas fa-moon',
        '02d': 'fas fa-cloud-sun',
        '02n': 'fas fa-cloud-moon',
        '03d': 'fas fa-cloud',
        '03n': 'fas fa-cloud',
        '04d': 'fas fa-cloud',
        '04n': 'fas fa-cloud',
        '09d': 'fas fa-cloud-rain',
        '09n': 'fas fa-cloud-rain',
        '10d': 'fas fa-cloud-sun-rain',
        '10n': 'fas fa-cloud-moon-rain',
        '11d': 'fas fa-bolt',
        '11n': 'fas fa-bolt',
        '13d': 'fas fa-snowflake',
        '13n': 'fas fa-snowflake',
        '50d': 'fas fa-smog',
        '50n': 'fas fa-smog'
    }
};

console.log('✅ WeatherFlow Configured with Real API Key!');
console.log('🌤️ Live weather data enabled');

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}