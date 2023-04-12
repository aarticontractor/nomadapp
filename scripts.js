const apiKey = "20f9a6ae4f100c34e7ae026eafd6150d";
var cityName = document.getElementById("city-input");
const setCity = document.getElementById("city-name");
var searchCity = document.getElementById("search-city");


const localeSettings = {};
dayjs.locale(localeSettings);
var all_cities = JSON.parse(localStorage.getItem('top_10_cities')) || [];

var currentDay = document.getElementById("day");
var currentEmoji = document.getElementById("emoji");
var currentTemp = document.getElementById("temp");
var currentHumidity = document.getElementById("humidity");
var currentWind = document.getElementById("wind");


function getLatLon(currentCity) {
  var apiUrl =
      "http://api.openweathermap.org/geo/1.0/direct?q=" +
      currentCity +
      "&limit=5&appid=" +
      apiKey;
  console.log(apiUrl)
  return fetch(apiUrl)
      .then(function (data) {
          return data.json();
      })
      .then(function (data) {
          console.log(data);
          var lat = data[0].lat;
          var lon = data[0].lon;
          return {
              lat,
              lon
          }; // return an object with lat and lon values
      })
      .catch(function (error) {
          console.log(error);
      });
}


searchCity.addEventListener("click", function () {
  event.preventDefault();
  var currentCity = cityName.value;
  
  getLatLon(currentCity).then(function (data) {
      var lat = data.lat;
      var lon = data.lon;
      console.log(lat, lon);

      getWeather(lat, lon);

  });
});

function getWeather(lat, lon) {
  var weatherUrl = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial"
  console.log(weatherUrl);
  return fetch(weatherUrl)
      .then(function (data) {
          return data.json();
      })
      .then(function (data) {
          // console.log(data);
          var city = data.city.name;
          console.log(data);
          setCity.textContent = city;
          var currentDate = (data.list[0].dt_txt).split(" ")[0];
          var convertedDay = dayjs(currentDate);
          var humanReadableDate = convertedDay.locale('en').format('DD, MMMM, YYYY');
          currentDay.textContent = humanReadableDate;
          currentTemp.textContent = data.list[0].main.temp;
          currentHumidity.textContent = data.list[0].main.humidity;
          currentWind.textContent = data.list[0].wind.speed;
          
          var weather = data.list[0].weather[0].main;
              if (weather == "Clouds") {
                  currentEmoji.textContent = '☁️';
              } else if (weather == "Rain") {
                  currentEmoji.textContent = '🌧️';
              } else {
                  currentEmoji.textContent = '🌞';
              }

      })
      .catch(function (error) {
          console.log(error);
      });
}

