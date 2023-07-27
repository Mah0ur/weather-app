function setDateTime(now) {
  let day = days[now.getDay()];
  let month = months[now.getMonth()];
  let date = now.getDate();
  let year = now.getFullYear();
  let hour = String(now.getHours()).padStart(2, "0");
  let minute = String(now.getMinutes()).padStart(2, "0");
  let currentDateTime = document.querySelector("#current-date-time");
  let forcast = [];
  for (let i = 0; i < 5; i++) {
    forcast[i] = document.querySelector(`#forcast-${i + 1}`);
    if (now.getDay() + i < 6) {
      forcast[i].innerHTML = days[now.getDay() + i + 1].slice(0, 3);
    } else {
      forcast[i].innerHTML = days[now.getDay() + i - 6].slice(0, 3);
    }
  }

  currentDateTime.innerHTML = `${day}, ${month} ${date}, ${year}<br>${hour}:${minute}`;
}
function fetchLocation() {
  document.querySelector("#desired-location").value = "";
  navigator.geolocation.getCurrentPosition(retrievePosition);
}
function retrievePosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${apiKey}`;
  axios.get(url).then(function (response) {
    let currentLocation = response.data[0].name;
    handleCity(currentLocation);
  });
}
function handleSearch(event) {
  event.preventDefault();
  let desiredCity = document.querySelector("#desired-location").value;
  desiredCity = desiredCity.trim().toLowerCase();
  desiredCity = desiredCity.charAt(0).toUpperCase() + desiredCity.slice(1);
  handleCity(desiredCity);
}

function handleCity(city) {
  if (currentUnit === "f") {
    fToC();
  }
  let currentLocation = document.querySelector("#current-location");
  let currentTemp = document.querySelector("#current-temp");
  let feelsLikeTemp = document.querySelector("#feels-like-temp");
  let maxCurrentTemp = document.querySelector("#max-current-temp");
  let minCurrentTemp = document.querySelector("#min-current-temp");
  let humidity = document.querySelector("#humidity");
  let windSpeed = document.querySelector("#wind-speed");
  let visibility = document.querySelector("#visibility");
  let pressure = document.querySelector("#pressure");
  let weatherDescription = document.querySelector("#weather-description")

  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
  let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`;

  axios.get(url).then(function (response) {
    console.log(response.data);
    let cityTime = new Date(
      now.getTime() + (response.data.timezone + localZone) * 1000
    );
    let country = response.data.sys.country;
    let cityCurrentTemp = Math.round(response.data.main.temp);
    let cityFeelsLikeTemp = Math.round(response.data.main.feels_like);
    let cityHumidity = response.data.main.humidity;
    let cityWindSpeed = response.data.wind.speed;
    let cityVisibility = Math.round(response.data.visibility / 1000);
    let cityPressure = response.data.main.pressure;
    let cityWeatherDescription = response.data.weather[0].description;
    cityWeatherDescription = cityWeatherDescription.charAt(0).toUpperCase() + cityWeatherDescription.slice(1)
    setDateTime(cityTime);
    currentLocation.innerHTML = `${city}, ${country}`;
    currentTemp.innerHTML = cityCurrentTemp;
    feelsLikeTemp.innerHTML = cityFeelsLikeTemp;
    humidity.innerHTML = cityHumidity;
    windSpeed.innerHTML = cityWindSpeed;
    visibility.innerHTML = cityVisibility;
    pressure.innerHTML = cityPressure;
    weatherDescription.innerHTML = cityWeatherDescription;
  })
  axios.get(forecastUrl).then(function (response) {
    console.log(response.data);
    let cityMaxCurrentTemp = Math.round(response.data.list[0].main.temp_max);
    let cityMinCurrentTemp = Math.round(response.data.list[0].main.temp_min);
    for (let i = 1; i < 4; i++) {
      if (response.data.list[i].main.temp_max > cityMaxCurrentTemp) {
        cityMaxCurrentTemp = Math.round(response.data.list[i].main.temp_max);
      }
      if (response.data.list[i].main.temp_min < cityMinCurrentTemp) {
        cityMinCurrentTemp = Math.round(response.data.list[i].main.temp_min);
      }
    }
    maxCurrentTemp.innerHTML = cityMaxCurrentTemp;
    minCurrentTemp.innerHTML = cityMinCurrentTemp;
  });
}

function fToC() {
  currentUnit = "c";
  degC.removeAttribute("href");
  degF.setAttribute("href", "#");
  let temp = document.querySelectorAll(".temp");
  temp.forEach(function (element) {
    element.innerHTML = Math.round(((element.innerHTML - 32) * 5) / 9);
  });
}

function cToF() {
  currentUnit = "f";
  degF.removeAttribute("href");
  degC.setAttribute("href", "#");
  let temp = document.querySelectorAll(".temp");
  temp.forEach(function (element) {
    element.innerHTML = Math.round((element.innerHTML * 9) / 5 + 32);
  });
}

let apiKey = "b35c686ba9565ba0ab254c2230937552";
let unit = "metric";
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

let now = new Date();
let localZone = now.getTimezoneOffset() * 60;
let searchCity = document.querySelector("#search-city");
let currentUnit = "c";
let degC = document.querySelector("#deg-c");
let degF = document.querySelector("#deg-f");
let fetchLocationButton = document.querySelector("#fetch-location");

fetchLocation();
setDateTime(now);
degC.removeAttribute("href");
searchCity.addEventListener("submit", handleSearch);
degC.addEventListener("click", fToC);
degF.addEventListener("click", cToF);
fetchLocationButton.addEventListener("click", fetchLocation);
