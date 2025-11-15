// UI Controller - Handles all DOM manipulations and user interactions
class WeatherUI {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
    }

    // Initialize DOM elements
    initializeElements() {
        this.elements = {
            // Input elements
            cityInput: document.getElementById('cityInput'),
            searchBtn: document.getElementById('searchBtn'),
            locationBtn: document.getElementById('locationBtn'),
            searchError: document.getElementById('searchError'),
            
            // Weather display elements
            cityName: document.getElementById('cityName'),
            currentDate: document.getElementById('currentDate'),
            currentTemp: document.getElementById('currentTemp'),
            weatherDescription: document.getElementById('weatherDescription'),
            weatherIcon: document.getElementById('weatherIcon'),
            
            // Weather details
            windSpeed: document.getElementById('windSpeed'),
            humidity: document.getElementById('humidity'),
            pressure: document.getElementById('pressure'),
            visibility: document.getElementById('visibility'),
            
            // Forecast
            forecastContainer: document.getElementById('forecastContainer'),
            
            // Additional info
            sunrise: document.getElementById('sunrise'),
            sunset: document.getElementById('sunset'),
            feelsLike: document.getElementById('feelsLike'),
            rainChance: document.getElementById('rainChance'),
            
            // Sections
            currentWeather: document.getElementById('currentWeather'),
            forecastSection: document.getElementById('forecastSection'),
            additionalInfo: document.getElementById('additionalInfo'),
            loadingScreen: document.getElementById('loadingScreen'),
            apiStatus: document.getElementById('apiStatus')
        };
    }

    // Setup event listeners
    setupEventListeners() {
        // Search button click
        this.elements.searchBtn.addEventListener('click', () => {
            this.handleSearch();
        });

        // Enter key in search input
        this.elements.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        // Current location button
        this.elements.locationBtn.addEventListener('click', () => {
            this.handleLocationSearch();
        });

        // Input validation
        this.elements.cityInput.addEventListener('input', () => {
            this.clearError();
        });
    }

    // Handle city search
    async handleSearch() {
        const city = this.elements.cityInput.value.trim();
        
        if (!city) {
            this.showError('Please enter a city name');
            return;
        }

        await this.loadWeatherData(city);
    }

    // Handle location-based search
    async handleLocationSearch() {
        this.showLoading('Getting your location...');
        
        try {
            const coords = await weatherAPI.getCurrentLocation();
            const weatherData = await weatherAPI.getWeatherByCoords(coords.lat, coords.lon);
            this.displayWeatherData(weatherData);
            this.loadForecast(weatherData.name);
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.hideLoading();
        }
    }

    // Main method to load and display weather data
    async loadWeatherData(city) {
        this.showLoading(`Loading weather for ${city}...`);
        
        try {
            const weatherData = await weatherAPI.getCurrentWeather(city);
            this.displayWeatherData(weatherData);
            await this.loadForecast(city);
            this.clearError();
            this.updateAPISatus(true);
        } catch (error) {
            this.showError(error.message);
            this.updateAPISatus(false);
        } finally {
            this.hideLoading();
        }
    }

    // Display current weather data
    displayWeatherData(data) {
        console.log('📊 Displaying weather data:', data);
        
        // Update basic info
        this.elements.cityName.textContent = `${data.name}, ${data.sys.country}`;
        this.elements.currentDate.textContent = this.formatDate(new Date());
        this.elements.currentTemp.textContent = `${Math.round(data.main.temp)}°`;
        this.elements.weatherDescription.textContent = data.weather[0].description;
        
        // Update weather icon
        const iconCode = data.weather[0].icon;
        this.elements.weatherIcon.className = this.getWeatherIcon(iconCode);
        
        // Update weather details
        this.elements.windSpeed.textContent = `${data.wind.speed} km/h`;
        this.elements.humidity.textContent = `${data.main.humidity}%`;
        this.elements.pressure.textContent = `${data.main.pressure} hPa`;
        this.elements.visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
        
        // Update additional info
        this.elements.sunrise.textContent = this.formatTime(data.sys.sunrise);
        this.elements.sunset.textContent = this.formatTime(data.sys.sunset);
        this.elements.feelsLike.textContent = `${Math.round(data.main.feels_like)}°`;
        
        // Show all sections
        this.showWeatherSections();
        
        // Add animation
        this.animateWeatherCard();
    }

    // Load and display forecast
    async loadForecast(city) {
        try {
            const forecastData = await weatherAPI.getForecast(city);
            this.displayForecast(forecastData);
        } catch (error) {
            console.error('Forecast loading failed:', error);
        }
    }

    // Display 5-day forecast
    displayForecast(data) {
        const forecastContainer = this.elements.forecastContainer;
        forecastContainer.innerHTML = '';
        
        // Group forecasts by day and take one reading per day
        const dailyForecasts = this.getDailyForecasts(data.list);
        
        dailyForecasts.forEach(forecast => {
            const forecastElement = this.createForecastElement(forecast);
            forecastContainer.appendChild(forecastElement);
        });
    }

    // Helper to get one forecast per day
    getDailyForecasts(forecastList) {
        const dailyForecasts = [];
        const processedDays = new Set();
        
        forecastList.forEach(forecast => {
            const date = new Date(forecast.dt * 1000);
            const day = date.toDateString();
            
            if (!processedDays.has(day) && dailyForecasts.length < 5) {
                processedDays.add(day);
                dailyForecasts.push(forecast);
            }
        });
        
        return dailyForecasts;
    }

    // Create forecast element
    createForecastElement(forecast) {
        const date = new Date(forecast.dt * 1000);
        const day = this.formatDay(date);
        const iconCode = forecast.weather[0].icon;
        const temp = Math.round(forecast.main.temp);
        const description = forecast.weather[0].description;
        
        const forecastElement = document.createElement('div');
        forecastElement.className = 'forecast-item fade-in';
        forecastElement.innerHTML = `
            <div class="forecast-day">${day}</div>
            <div class="forecast-icon">
                <i class="${this.getWeatherIcon(iconCode)}"></i>
            </div>
            <div class="forecast-temp">${temp}°</div>
            <div class="forecast-desc">${description}</div>
        `;
        
        return forecastElement;
    }

    // Utility methods
    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatDay(date) {
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    }

    formatTime(timestamp) {
        return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }

    getWeatherIcon(iconCode) {
        return CONFIG.WEATHER_ICONS[iconCode] || 'fas fa-cloud';
    }

    // UI state management
    showLoading(message = 'Loading...') {
        this.elements.loadingScreen.classList.remove('hidden');
        if (message) {
            const loaderText = this.elements.loadingScreen.querySelector('p');
            if (loaderText) loaderText.textContent = message;
        }
    }

    hideLoading() {
        this.elements.loadingScreen.classList.add('hidden');
    }

    showError(message) {
        this.elements.searchError.textContent = message;
        this.elements.searchError.style.display = 'block';
    }

    clearError() {
        this.elements.searchError.textContent = '';
        this.elements.searchError.style.display = 'none';
    }

    showWeatherSections() {
        this.elements.currentWeather.style.display = 'block';
        this.elements.forecastSection.style.display = 'block';
        this.elements.additionalInfo.style.display = 'block';
    }

    updateAPISatus(connected) {
        const statusIndicator = this.elements.apiStatus;
        statusIndicator.style.background = connected ? 'var(--success)' : 'var(--error)';
    }

    animateWeatherCard() {
        const weatherCard = document.querySelector('.weather-card');
        weatherCard.classList.remove('fade-in');
        void weatherCard.offsetWidth; // Trigger reflow
        weatherCard.classList.add('fade-in');
    }
}