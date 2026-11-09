const form = document.querySelector('#search-form');
const cityInput = document.querySelector('#city-input');
const searchButton = document.querySelector('#search-button');
const statusBox = document.querySelector('#status');
const weatherContent = document.querySelector('#weather-content');

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

function showStatus(message, type) {
  statusBox.textContent = message;
  statusBox.className = `status ${type}`;
  statusBox.hidden = false;
}
function hideStatus() { statusBox.hidden = true; }
function weatherDescription(code) {
  if (code === 0) return ['Clear sky', '☀️'];
  if ([1, 2].includes(code)) return ['Mainly clear', '🌤️'];
  if (code === 3) return ['Overcast', '☁️'];
  if ([45, 48].includes(code)) return ['Foggy', '🌫️'];
  if ([51, 53, 55, 56, 57].includes(code)) return ['Drizzle', '🌦️'];
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return ['Rain', '🌧️'];
  if ([71, 73, 75, 77, 85, 86].includes(code)) return ['Snow', '❄️'];
  if ([95, 96, 99].includes(code)) return ['Thunderstorm', '⛈️'];
  return ['Variable conditions', '🌥️'];
}
function formatDay(dateString, options = { weekday: 'short' }) {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString(undefined, options);
}
function setText(id, value) { document.getElementById(id).textContent = value; }

async function getCoordinates(city) {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Unable to search for that city. Please try again.');
  const data = await response.json();
  if (!data.results || data.results.length === 0) throw new Error(`We couldn't find "${city}". Check the spelling and try again.`);
  return data.results[0];
}
async function getForecast(latitude, longitude) {
  const params = new URLSearchParams({
    latitude, longitude, timezone: 'auto', forecast_days: '5',
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,wind_speed_10m',
    hourly: 'temperature_2m,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min'
  });
  const response = await fetch(`${FORECAST_URL}?${params}`);
  if (!response.ok) throw new Error('Weather service is temporarily unavailable. Please try again.');
  return response.json();
}
function renderWeather(place, data) {
  const current = data.current;
  const [condition, icon] = weatherDescription(current.weather_code);
  setText('location-name', `${place.name}${place.admin1 ? `, ${place.admin1}` : ''}, ${place.country}`);
  setText('current-date', new Date(current.time).toLocaleString(undefined, { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' }));
  setText('temperature', `${Math.round(current.temperature_2m)}°`);
  setText('condition', condition);
  setText('feels-like', `Feels like ${Math.round(current.apparent_temperature)}°`);
  setText('humidity', `${current.relative_humidity_2m}%`);
  setText('wind', `${Math.round(current.wind_speed_10m)} km/h`);
  setText('metric-feels', `${Math.round(current.apparent_temperature)}°`);
  setText('cloud', `${current.cloud_cover}%`);
  setText('updated-at', `Updated ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
  document.querySelector('#weather-icon').textContent = icon;

  const hourly = document.querySelector('#hourly-list');
  const currentHour = new Date(current.time).getHours();
  const startIndex = data.hourly.time.findIndex(t => new Date(t).getHours() === currentHour && t.slice(0, 10) === current.time.slice(0, 10));
  const first = Math.max(0, startIndex);
  hourly.innerHTML = data.hourly.time.slice(first, first + 6).map((time, index) => {
    const i = first + index;
    const [, hourIcon] = weatherDescription(data.hourly.weather_code[i]);
    const label = index === 0 ? 'Now' : new Date(time).toLocaleTimeString([], { hour: 'numeric' });
    return `<div class="hour-item"><div class="hour-time">${label}</div><div class="hour-icon">${hourIcon}</div><div class="hour-temp">${Math.round(data.hourly.temperature_2m[i])}°</div></div>`;
  }).join('');

  document.querySelector('#daily-list').innerHTML = data.daily.time.map((date, i) => {
    const [, dayIcon] = weatherDescription(data.daily.weather_code[i]);
    const day = i === 0 ? 'Today' : formatDay(date);
    return `<div class="day-item"><span class="day-name">${day}</span><span class="day-icon">${dayIcon}</span><span class="day-temps"><strong>${Math.round(data.daily.temperature_2m_max[i])}°</strong>${Math.round(data.daily.temperature_2m_min[i])}°</span></div>`;
  }).join('');
  weatherContent.hidden = false;
}

async function searchWeather(city) {
  const trimmedCity = city.trim();
  if (!trimmedCity) { showStatus('Please enter a city name to search.', 'error'); cityInput.focus(); return; }
  searchButton.disabled = true;
  searchButton.textContent = 'Loading…';
  weatherContent.hidden = true;
  showStatus(`Finding the latest weather for ${trimmedCity}…`, 'loading');
  try {
    const place = await getCoordinates(trimmedCity);
    const forecast = await getForecast(place.latitude, place.longitude);
    renderWeather(place, forecast);
    hideStatus();
  } catch (error) {
    showStatus(error.message || 'Something went wrong. Please check your connection and try again.', 'error');
  } finally {
    searchButton.disabled = false;
    searchButton.innerHTML = 'Search <span aria-hidden="true">→</span>';
  }
}
form.addEventListener('submit', event => {
  event.preventDefault();
  searchWeather(cityInput.value);
});
searchWeather(cityInput.value);
