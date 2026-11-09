# SkyCast – Weather Forecast Application

## Project description

SkyCast is a responsive weather application built for the Week 2 Async JavaScript & APIs task. Users can search for a city and view current conditions, key weather measurements, an hourly forecast, and a five-day forecast. It uses JavaScript `fetch()` to communicate with the Open-Meteo Geocoding and Forecast APIs.

## Technologies and tools

- HTML5
- CSS3 (responsive layout and mobile breakpoints)
- Vanilla JavaScript (ES6+, async/await, Fetch API, DOM manipulation)
- Open-Meteo Geocoding API: https://geocoding-api.open-meteo.com/v1/search
- Open-Meteo Forecast API: https://api.open-meteo.com/v1/forecast

No API key, package installation, or build step is required.

## Features

- Search weather by city name
- Current temperature, condition, and apparent temperature
- Humidity, wind speed, and cloud cover
- Six-hour outlook and five-day forecast
- Loading state while requests are in progress
- Error state for blank input, unknown cities, HTTP errors, and network failures
- Responsive desktop and mobile layout
- Automatically loads Siliguri on first launch (change this default in `Source_Code/index.html` if desired)

## Project structure

```text
SkyCast_Weather_App/
├── Source_Code/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── Output/
│   ├── screenshot_desktop.png
│   └── screenshot_mobile.png
└── README.md
```

## Installation requirements

- A modern browser (Chrome, Edge, Firefox, or Safari)
- Internet connection (to call Open-Meteo and load Google Fonts)

There are no third-party JavaScript dependencies.

## Steps to run

1. Download and extract the project ZIP.
2. Open `Source_Code/index.html` in a modern browser.
3. Keep an internet connection enabled.
4. Wait for the default Siliguri weather to load, or enter another city and click **Search**.

Recommended local-server option (optional): open a terminal in `Source_Code` and run `python -m http.server 8000`, then visit `http://localhost:8000`.

## API request flow

1. The user submits a city name.
2. `getCoordinates()` calls the Open-Meteo Geocoding API using `fetch()` and URL-encodes the city name.
3. `getForecast()` calls the Forecast API using the returned latitude and longitude.
4. `renderWeather()` updates the page with current, hourly, and daily data.
5. `searchWeather()` manages loading, success, and error states using `try/catch/finally`.

## Output description

The application displays the selected location, local date/time, current conditions, humidity, wind speed, apparent temperature, cloud cover, six hourly forecast entries, and five daily forecast entries. A desktop screenshot is saved in the `Output` folder. It uses representative test data; live values are fetched from Open-Meteo when the app runs. For the required mobile-view proof, open the app in Chrome DevTools, toggle the device toolbar, select a mobile viewport, and save a screenshot into `Output`.

## Testing

See [TESTING.md](TESTING.md) for manual test cases and results. JavaScript syntax can be checked with `node --check Source_Code/script.js`.

## Data attribution

Weather information is provided by [Open-Meteo](https://open-meteo.com/).
