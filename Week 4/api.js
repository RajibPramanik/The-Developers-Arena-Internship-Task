// Weather API Service - Handles all API interactions
class WeatherAPI {
    constructor() {
        this.baseURL = CONFIG.WEATHER_API.BASE_URL;
        this.apiKey = CONFIG.WEATHER_API.API_KEY;
        this.units = CONFIG.WEATHER_API.UNITS;
        this.cache = new Map();
    }

    // Helper method to build API URL
    buildURL(endpoint, params = {}) {
        const url = new URL(`${this.baseURL}/${endpoint}`);
        const defaultParams = {
            appid: this.apiKey,
            units: this.units,
            ...params
        };
        
        Object.entries(defaultParams).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
        
        return url.toString();
    }

    // Generic API request method with error handling
    async makeRequest(url) {
        try {
            console.log(`🌐 Making API request to: ${url}`);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ API response received:', data);
            return data;
            
        } catch (error) {
            console.error('❌ API request failed:', error);
            throw new Error(this.getErrorMessage(error));
        }
    }

    // Get current weather by city name
    async getCurrentWeather(city) {
        const cacheKey = `current_${city}`;
        
        // Check cache first
        if (this.isCacheValid(cacheKey)) {
            console.log('📦 Using cached data for:', city);
            return this.cache.get(cacheKey).data;
        }
        
        const url = this.buildURL('weather', { q: city });
        const data = await this.makeRequest(url);
        
        // Cache the response
        this.cache.set(cacheKey, {
            data: data,
            timestamp: Date.now()
        });
        
        return data;
    }

    // Get 5-day forecast by city name
    async getForecast(city) {
        const cacheKey = `forecast_${city}`;
        
        if (this.isCacheValid(cacheKey)) {
            console.log('📦 Using cached forecast for:', city);
            return this.cache.get(cacheKey).data;
        }
        
        const url = this.buildURL('forecast', { q: city });
        const data = await this.makeRequest(url);
        
        this.cache.set(cacheKey, {
            data: data,
            timestamp: Date.now()
        });
        
        return data;
    }

    // Get weather by geographic coordinates
    async getWeatherByCoords(lat, lon) {
        const cacheKey = `coords_${lat}_${lon}`;
        
        if (this.isCacheValid(cacheKey)) {
            return this.cache.get(cacheKey).data;
        }
        
        const url = this.buildURL('weather', { lat, lon });
        const data = await this.makeRequest(url);
        
        this.cache.set(cacheKey, {
            data: data,
            timestamp: Date.now()
        });
        
        return data;
    }

    // Get user's current location
    getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser.'));
                return;
            }
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log('📍 Location obtained:', latitude, longitude);
                    resolve({ lat: latitude, lon: longitude });
                },
                (error) => {
                    console.error('❌ Geolocation error:', error);
                    reject(new Error('Unable to retrieve your location.'));
                },
                {
                    timeout: 10000,
                    enableHighAccuracy: true
                }
            );
        });
    }

    // Cache validation helper
    isCacheValid(key) {
        if (!this.cache.has(key)) return false;
        
        const cached = this.cache.get(key);
        const age = Date.now() - cached.timestamp;
        return age < CONFIG.SETTINGS.CACHE_DURATION;
    }

    // Error message mapping
    getErrorMessage(error) {
        const errorMap = {
            '404': 'City not found. Please check the spelling and try again.',
            '401': 'Invalid API key. Please check your configuration.',
            '429': 'Too many requests. Please wait a moment.',
            'network': 'Network error. Please check your internet connection.'
        };
        
        if (error.message.includes('404')) return errorMap['404'];
        if (error.message.includes('401')) return errorMap['401'];
        if (error.message.includes('429')) return errorMap['429'];
        if (error.message.includes('Failed to fetch')) return errorMap['network'];
        
        return 'Unable to fetch weather data. Please try again.';
    }

    // Test API connection
    async testConnection() {
        try {
            const testCity = CONFIG.FALLBACK_DATA.city;
            const data = await this.getCurrentWeather(testCity);
            return {
                success: true,
                message: 'API connection successful',
                data: data
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
}

// Create and export API instance
const weatherAPI = new WeatherAPI();