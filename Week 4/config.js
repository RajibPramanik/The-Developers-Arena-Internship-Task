const CONFIG = {
    WEATHER_API: {
        BASE_URL: "https://api.openweathermap.org/data/2.5",
        API_KEY: "6938350e5c6e7ebee26f5f459369a816",
        UNITS: "metric"
    },
    SETTINGS: {
        DEFAULT_CITY: "London",
        CACHE_DURATION: 10 * 60 * 1000,
        MAX_SEARCH_HISTORY: 5
    },
    FALLBACK_DATA: {
        city: "London"
    },
    WEATHER_ICONS: {
        "01d": "fas fa-sun",
        "01n": "fas fa-moon",
        "02d": "fas fa-cloud-sun",
        "02n": "fas fa-cloud-moon",
        "03d": "fas fa-cloud",
        "03n": "fas fa-cloud",
        "04d": "fas fa-cloud-meatball",
        "04n": "fas fa-cloud-meatball",
        "09d": "fas fa-cloud-showers-heavy",
        "09n": "fas fa-cloud-showers-heavy",
        "10d": "fas fa-cloud-sun-rain",
        "10n": "fas fa-cloud-moon-rain",
        "11d": "fas fa-bolt",
        "11n": "fas fa-bolt",
        "13d": "fas fa-snowflake",
        "13n": "fas fa-snowflake",
        "50d": "fas fa-smog",
        "50n": "fas fa-smog"
    }
};
