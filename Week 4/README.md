# Week 4: Frontend Integration & Final Project

# Weather Application Full Stack Integration
A simple, responsive Weather Application that fetches real-time data from the OpenWeatherMap API and displays it with a clean UI. Perfect as a Week-4 final project to demonstrate frontend–backend integration, async JavaScript, and deployment on GitHub Pages.

---

## 🔍 Overview
Users search for a city name and the app displays current weather details retrieved from the OpenWeatherMap REST API (JSON). The app demonstrates `fetch()` (promises / `async`-`await`), error handling, responsive UI, and GitHub Pages deployment.

---

## ✨ Features

* Search weather by **city name**
* Shows **temperature**, **humidity**, **wind speed**, and **weather description**
* Loading and error states (invalid city / API failures)
* Mobile responsive design and attractive UI
* Uses OpenWeatherMap API (free tier)

---

## 🛠 Technologies

* **Frontend:** HTML, CSS, JavaScript
* **API:** OpenWeatherMap
* **Async model:** `fetch()` with Promises / `async`-`await`

---

## ✅ UI / UX considerations

* Show a spinner or skeleton while loading
* Validate input (non-empty city)
* Friendly error messages (e.g., “City not found” for 404)
* Preserve last searched city in `localStorage`
* Use weather icons (from OpenWeatherMap or a free icon set)
* Make layout responsive (mobile-first)

---

## 📌 Example UX flow

1. User enters `London` → presses Enter / Search.
2. App shows loading state.
3. API returns JSON → app displays:

   * Temperature: **16°C**
   * Humidity: **75%**
   * Wind Speed: **5 m/s**
   * Condition: **Clear sky**
4. If city invalid → show “City not found” message.

---

