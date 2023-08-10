function setDateTime(now) {
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
  let day = days[now.getDay()];
  let month = months[now.getMonth()];
  let date = now.getDate();
  let year = now.getFullYear();
  let hour = String(now.getHours()).padStart(2, "0");
  let minute = String(now.getMinutes()).padStart(2, "0");
  let currentDateTime = document.querySelector("#current-date-time");
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
  handleCity(desiredCity);
}

function handleCity(city) {
  if (currentUnit === "f") {
    fToC();
  }
  let now = new Date();
  let localZone = now.getTimezoneOffset() * 60;
  let currentLocation = document.querySelector("#current-location");
  let currentTemp = document.querySelector("#current-temp");
  let feelsLikeTemp = document.querySelector("#feels-like-temp");
  let humidity = document.querySelector("#humidity");
  let windSpeed = document.querySelector("#wind-speed");
  let visibility = document.querySelector("#visibility");
  let pressure = document.querySelector("#pressure");
  let weatherDescription = document.querySelector("#weather-description")
  let currentIcon = document.querySelector("#current-icon")
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

  axios.get(url).then(function (response) {
    cityTime = new Date(
      now.getTime() + (response.data.timezone + localZone) * 1000
    );
    setDateTime(cityTime);
    if (response.data.dt - response.data.sys.sunrise > 0 && response.data.sys.sunset - response.data.dt > 0) {
      document.getElementById("main-container").style.background = "radial-gradient(circle at 10% 20%, rgb(253, 239, 132) 0%, rgb(247, 198, 169) 54.2%, rgb(21, 186, 196) 100.3%)"
      document.getElementById("main-container").style.color = "black"
      document.getElementById("search-button").style.color = "black"
    } else {
      document.getElementById("main-container").style.background = "linear-gradient(1.14deg,rgb(20, 36, 50) 11.8%,rgb(124, 143, 161) 83.8%)"
      document.getElementById("main-container").style.color = "white"
      document.getElementById("search-button").style.color = "white"
    }

    let country = response.data.sys.country;
    let cityCurrentIcon = response.data.weather[0].icon
    currentLocation.innerHTML = `${city}, ${country}`;
    currentTemp.innerHTML = Math.round(response.data.main.temp);
    feelsLikeTemp.innerHTML = Math.round(response.data.main.feels_like);
    humidity.innerHTML = response.data.main.humidity;
    windSpeed.innerHTML = response.data.wind.speed;
    visibility.innerHTML = Math.round(response.data.visibility / 1000);
    pressure.innerHTML = response.data.main.pressure;
    weatherDescription.innerHTML = response.data.weather[0].description;
    currentIcon.setAttribute("src", `https://openweathermap.org/img/wn/${cityCurrentIcon}@2x.png`)
    currentIcon.setAttribute("alt", response.data.weather[0].description)
    
    let forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}&appid=${apiKey}&units=${unit}`;
    axios.get(forecastUrl).then(displayForecast);
  })
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

function displayForecast(response){
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday"
  ];
  let forecastElement = document.querySelector("#forecast")
  let forecastHTML = "";
  for (let i = 1; i < 6; i++) {
    let cityforecastIcon = response.data.daily[i].weather[0].icon
    forecastHTML = forecastHTML + `
      <div class="col daily-forecast">
        <h6>${days[cityTime.getDay() + i].slice(0, 3)}</h6>
        <img src="https://openweathermap.org/img/wn/${cityforecastIcon}@2x.png" 
        alt="${response.data.daily[i].weather[0].description}" />
        <p>
          <span class="temp">${Math.round(response.data.daily[i].temp.max)}</span><small>°</small>/
          <span class="temp">${Math.round(response.data.daily[i].temp.min)}</span><small>°</small>
        </p>
      </div>
    `;
  }
  forecastElement.innerHTML = forecastHTML;
  let maxCurrentTemp = document.querySelector("#max-current-temp");
  let minCurrentTemp = document.querySelector("#min-current-temp");
  maxCurrentTemp.innerHTML = Math.round(response.data.daily[0].temp.max);
  minCurrentTemp.innerHTML = Math.round(response.data.daily[0].temp.min);
}

let apiKey = "5201594abea9f3e38b70e65b11a80c24";
let unit = "metric";
let currentUnit = "c";
let cityTime = null;

let searchCity = document.querySelector("#search-city");
let degC = document.querySelector("#deg-c");
let degF = document.querySelector("#deg-f");
let fetchLocationButton = document.querySelector("#fetch-location");

fetchLocation();
degC.removeAttribute("href");
searchCity.addEventListener("submit", handleSearch);
degC.addEventListener("click", fToC);
degF.addEventListener("click", cToF);
fetchLocationButton.addEventListener("click", fetchLocation);
