const api = {
  key: "cec000ac4fb969b7147720981ae2d497",
  base: "https://api.openweathermap.org/data/2.5/",
};
const input = document.querySelector(".input");
const cityName = document.querySelector(".cityName");
const windspeed = document.querySelector(".windspeed");
const notificationElement = document.querySelector(".notificationElement");
const humidity = document.querySelector(".humidity");
const cloud = document.querySelector(".cloud");
const tempDescriptyion = document.querySelector(".temp-descriptyion");
const degree = document.querySelector(".degree");
const date = document.querySelector(".date");
const icomElement = document.querySelector(".icomElement");
const container = document.querySelector(".container");

input.addEventListener("keypress", (e) => {
  if (e.keyCode == 13) {
    cityInput(input.value);
  }
});

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  notificationElement.style.dispay = "block";
  notificationElement.innerHTML = "<p>ERROR GEOLOCATION</p>";
}

function setPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  getWeather(latitude, longitude);
}

function showError(error) {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p>${error.message}</p>`;
}

function getWeather(latitude, longitude) {
  let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=cec000ac4fb969b7147720981ae2d497`;
  fetch(api)
    .then(function (response) {
      let data = response.json();
      return data;
    })
    .then(displayResults);
}

function cityInput(query) {
  fetch(`${api.base}weather?q=${query}&appid=${api.key}`)
    .then((weather) => {
      return weather.json();
    })
    .then(displayResults);
}

function displayResults(weather) {
  console.log(weather);
  let now = new Date();
  let data = date;

  //отслеживание времени города
  let localTime = now.getTime();
  let localOffset = now.getTimezoneOffset() * 60000;
  let utc = localTime + localOffset;
  let newUtc = utc + 1000 * `${weather.timezone}`;
  let nd = new Date(newUtc);
  console.log(nd.getHours());
  if (weather.message) {
    cityName.textContent = `${weather.message}`;
    icomElement.innerHTML = `<img src="icon/unknown.png">`;
    degree.textContent = 0;
    tempDescriptyion.textContent = "undefined";
    cloud.textContent = 0 + "hPa";
    windspeed.textContent = 0 + "m/h";
    humidity.textContent = 0 + "%";
  } else {
    cityName.textContent = `${weather.name}-${weather.sys.country}`;
  }

  if (nd.getHours() >= 7 && nd.getHours() <= 17) {
    container.style.background = "linear-gradient(#f8b195, #f67280, #c06c84)";
  } else {
    container.style.background = "linear-gradient(#c06c84, #6c5b7b, #355c7d)";
  }

  data.innerHTML = dateBuilder(now);
  let icon = (weather.icons = weather.weather[0].icon);

  icomElement.innerHTML = `<img src="icon/${icon}.png">`;
  degree.textContent = Math.round(weather.main.temp - 273);
  tempDescriptyion.textContent = weather.weather[0].description;
  cloud.textContent = `${weather.main.pressure}hPa`;
  windspeed.textContent = `${Math.round(weather.wind.speed * 3.6)}m/h`;
  humidity.textContent = `${weather.main.humidity}%`;
}

function dateBuilder(d) {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();
  return `${day} ${date} ${month} ${year}`;
}
