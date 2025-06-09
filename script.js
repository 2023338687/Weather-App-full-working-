// script.js

const locationInput = document.getElementById('location-input');
const tempEl = document.getElementById('temperature');
const conditionEl = document.getElementById('weather-condition');
const summaryEl = document.getElementById('summary');
const feelsLikeEl = document.getElementById('feels-like');
const precipitationEl = document.getElementById('precipitation');
const visibilityEl = document.getElementById('visibility');
const humidityEl = document.getElementById('humidity');
const hourlyForecastEl = document.getElementById('hourly-forecast');
const dailyForecastEl = document.getElementById('daily-forecast');
const uvIndexEl = document.getElementById('uv-index');
const windEl = document.getElementById('wind');

const API_KEY = '87aa26e0b8b9d108aa688eb641a498f5';
const CURRENT_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

async function fetchWeather(city) {
  try {
    const currentRes = await fetch(`${CURRENT_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    const currentData = await currentRes.json();
    if (currentData.cod !== 200) throw new Error(currentData.message);

    const forecastRes = await fetch(`${FORECAST_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    const forecastData = await forecastRes.json();
    if (forecastData.cod !== "200") throw new Error(forecastData.message);

    updateUI(currentData, forecastData);
  } catch (error) {
    alert('⚠️ Error fetching weather: ' + error.message);
    console.error('Fetch error:', error);
  }
}

function updateUI(current, forecast) {
  const temp = Math.round(current.main.temp);
  const feelsLike = Math.round(current.main.feels_like);

  tempEl.textContent = `${temp}°`;
  conditionEl.textContent = current.weather[0].main;
  summaryEl.textContent = `Expect a ${current.weather[0].main.toLowerCase()} day in ${current.name}. Humidity is at ${current.main.humidity}%.`;

  feelsLikeEl.innerHTML = `Feels Like: <span>${feelsLike}°</span>`;
  precipitationEl.innerHTML = `Precipitation: <span>2.3"</span>`; // Placeholder
  visibilityEl.innerHTML = `Visibility: <span>${current.visibility / 1000} km</span>`;
  humidityEl.innerHTML = `Humidity: <span>${current.main.humidity}%</span>`;

  updateHourlyForecast(forecast.list.slice(0, 6));
  updateDailyForecast(forecast.list);

  uvIndexEl.querySelector('span').textContent = '3 (Moderate)';
  windEl.innerHTML = `Wind: <span>${current.wind.speed} MPH</span><br>Gusts: <span>${current.wind.gust || 'N/A'} MPH</span><div class="compass"></div>`;
}

function updateHourlyForecast(data) {
  hourlyForecastEl.innerHTML = '';
  data.forEach(item => {
    const time = new Date(item.dt_txt).getHours();
    const temp = Math.round(item.main.temp);
    const icon = item.weather[0].icon;

    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <div>${time}:00</div>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" width="40" />
      <div>${temp}°</div>
    `;
    hourlyForecastEl.appendChild(div);
  });
}

function updateDailyForecast(data) {
  dailyForecastEl.innerHTML = '';
  const dailyMap = {};
  data.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyMap[date]) dailyMap[date] = item;
  });

  Object.values(dailyMap).slice(0, 6).forEach(day => {
    const weekday = new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short' });
    const temp = Math.round(day.main.temp);
    const icon = day.weather[0].icon;

    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <div>${weekday}</div>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" width="40" />
      <div>${temp}°</div>
    `;
    dailyForecastEl.appendChild(div);
  });
}

locationInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const city = locationInput.value.trim();
    if (city) fetchWeather(city);
  }
});

// Default city
fetchWeather('Hanoi');
