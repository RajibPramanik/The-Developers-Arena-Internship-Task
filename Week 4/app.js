// Main Application Controller
class WeatherApp {
    constructor() {
        this.ui = new WeatherUI();
        this.api = weatherAPI; // ✅ Add this line
        this.apiKey = CONFIG.WEATHER_API.API_KEY;
        this.searchHistory = this.loadSearchHistory();
        this.init();
    }

    // Initialize the application
    async init() {
        console.log('🚀 Initializing WeatherFlow Application...');
        
        // Test API connection
        await this.testAPIConnection();
        
        // Load default city weather
        await this.loadDefaultWeather();
        
        // Hide loading screen after initialization
        setTimeout(() => {
            this.ui.hideLoading();
        }, 1000);
        
        console.log('✅ WeatherFlow initialized successfully!');
    }

    // Test API connection
    async testAPIConnection() {
        console.log('🔌 Testing API connection...');
        
        const result = await this.api.testConnection();
        if (result.success) {
            console.log('✅ API connection test passed');
            this.ui.updateAPISatus(true);
        } else {
            console.warn('⚠️ API connection test failed:', result.message);
            this.ui.updateAPISatus(false);
            this.showAPINotice();
        }
    }

    // Load default city weather
    async loadDefaultWeather() {
        const defaultCity = CONFIG.SETTINGS.DEFAULT_CITY;
        console.log(`🌍 Loading default city: ${defaultCity}`);
        
        try {
            await this.ui.loadWeatherData(defaultCity);
        } catch (error) {
            console.error('Failed to load default weather:', error);
            this.showErrorState();
        }
    }

    // Show API setup notice
    showAPINotice() {
        const notice = document.createElement('div');
        notice.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--warning);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: var(--shadow);
            z-index: 1000;
            max-width: 300px;
        `;
        notice.innerHTML = `
            <strong>API Setup Required</strong>
            <p style="margin: 5px 0; font-size: 0.9em;">
                Get your free API key from OpenWeatherMap to enable live data.
            </p>
            <button onclick="this.parentElement.remove()" 
                    style="background: white; color: var(--warning); border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">
                Dismiss
            </button>
        `;
        document.body.appendChild(notice);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (notice.parentElement) {
                notice.remove();
            }
        }, 10000);
    }

    // Show error state
    showErrorState() {
        this.ui.elements.currentWeather.innerHTML = `
            <div class="weather-card" style="text-align: center; padding: 3rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--error); margin-bottom: 1rem;"></i>
                <h2>Unable to Load Weather Data</h2>
                <p>Please check your API configuration and try again.</p>
                <button onclick="window.location.reload()" 
                        style="background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 1rem;">
                    Retry
                </button>
            </div>
        `;
    }

    // Search history management
    loadSearchHistory() {
        const history = localStorage.getItem('weatherSearchHistory');
        return history ? JSON.parse(history) : [];
    }

    saveSearchHistory() {
        localStorage.setItem('weatherSearchHistory', JSON.stringify(this.searchHistory));
    }

    addToSearchHistory(city) {
        // Remove duplicates
        this.searchHistory = this.searchHistory.filter(item => item !== city);
        
        // Add to beginning
        this.searchHistory.unshift(city);
        
        // Limit history size
        if (this.searchHistory.length > CONFIG.SETTINGS.MAX_SEARCH_HISTORY) {
            this.searchHistory.pop();
        }
        
        this.saveSearchHistory();
    }

    // Utility method to get demo data (fallback)
    getDemoData() {
        return {
            name: 'London',
            sys: { country: 'GB' },
            main: {
                temp: 15,
                feels_like: 14,
                humidity: 65,
                pressure: 1013
            },
            weather: [{ description: 'clear sky', icon: '01d' }],
            wind: { speed: 3.5 },
            visibility: 10000,
            sys: { sunrise: 1678244400, sunset: 1678287600 }
        };
    }
}

// Additional utility functions
const WeatherUtils = {
    // Convert temperature between units
    convertTemperature(temp, fromUnit, toUnit) {
        if (fromUnit === toUnit) return temp;
        
        if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
            return (temp * 9/5) + 32;
        } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
            return (temp - 32) * 5/9;
        }
        
        return temp;
    },

    // Format wind direction from degrees
    formatWindDirection(degrees) {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round(degrees / 22.5) % 16;
        return directions[index];
    },

    // Calculate UV index level
    getUVIndexLevel(uvi) {
        if (uvi <= 2) return { level: 'Low', color: 'var(--success)' };
        if (uvi <= 5) return { level: 'Moderate', color: 'var(--warning)' };
        if (uvi <= 7) return { level: 'High', color: 'var(--accent)' };
        if (uvi <= 10) return { level: 'Very High', color: 'var(--error)' };
        return { level: 'Extreme', color: 'var(--error)' };
    },

    // Get weather advice based on conditions
    getWeatherAdvice(weather) {
        const main = weather.weather[0].main.toLowerCase();
        const temp = weather.main.temp;
        
        if (main.includes('rain')) {
            return "Don't forget your umbrella! ☔";
        } else if (main.includes('snow')) {
            return "Bundle up and drive safely! ⛄";
        } else if (temp > 30) {
            return "Stay hydrated and avoid sun exposure! 🥤";
        } else if (temp < 5) {
            return "Wear warm layers today! 🧣";
        } else {
            return "Perfect weather to go outside! 😊";
        }
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.weatherApp = new WeatherApp();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WeatherApp, WeatherUtils };
}