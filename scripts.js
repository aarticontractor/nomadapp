const apiKey = "20f9a6ae4f100c34e7ae026eafd6150d";
var cityName = document.getElementById("city-input");
const setCity = document.getElementById("city-name");
var searchCity = document.getElementById("search-city");
let factBoxSelector = document.getElementById('facts');
let queryCity =  ""
let queryExtract = ""
const wikiURL = "https://en.wikipedia.org/api/rest_v1/page/summary/"



const localeSettings = {};
dayjs.locale(localeSettings);
var all_cities = JSON.parse(localStorage.getItem('top_10_cities')) || [];

var currentDay = document.getElementById("day");
var currentEmoji = document.getElementById("emoji");
var currentTemp = document.getElementById("temp");
var currentHumidity = document.getElementById("humidity");
var currentWind = document.getElementById("wind");

var all_cities = JSON.parse(localStorage.getItem('top_10_cities')) || [];


function getLatLon(currentCity) {
  var apiUrl =
      "https://api.openweathermap.org/geo/1.0/direct?q=" +
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




function getWeather(lat, lon) {
  var weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial"
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
          saveCity(city);
          generateCitySearch();
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



function saveCity(cityName) {

  if (all_cities.length > 9) {
      all_cities.shift();
  }

  const index = all_cities.indexOf(cityName);
  console.log("Index is: " + index);
  console.log("ALL cities is: " + all_cities);
  if (index === -1) {
    all_cities.push(cityName);
  } else {
      all_cities.splice(index, 1);
      all_cities.push(cityName);
  }
  localStorage.setItem('top_10_cities', JSON.stringify(all_cities));

}

function generateCitySearch() {
  const container = document.querySelector('.button-container');
  container.innerHTML = '';
  const buttons = [];

  for (let i = 0; i < all_cities.length; i++) {
    const button = document.createElement('button');
    button.textContent = all_cities[i];
    button.id = 'button' + (i + 1);
    button.className = 'button  is-info';
    button.addEventListener('click', function() {
      const cityButton = this.textContent;
      setCity.textContent = cityButton;
      factboxUpdater (cityButton)
      console.log(cityButton);
      saveCity(cityButton);
      getLatLon(cityButton).then(function (data) {
      var lat = data.lat;
      var lon = data.lon;
      console.log(lat, lon);

      getWeather(lat, lon);

  });
    });
  buttons.push(button);
  container.appendChild(button);
  container.appendChild(document.createElement("br"));
}}


searchCity.addEventListener("click", function () {
  event.preventDefault();
  var currentCity = cityName.value;
  let queryCity = cityName.value;
 factboxUpdater (queryCity)
  getLatLon(currentCity).then(function (data) {
      var lat = data.lat;
      var lon = data.lon;
      console.log(lat, lon);

      getWeather(lat, lon);

  });
});


function factboxUpdater (queryCity){
  fetch(wikiURL + queryCity + "?redirect=true")  
.then(function(response) {
    return response.json()
  })
.then(function(response) {
  queryExtract = response.extract
  console.log(queryExtract)
  let funFact = document.createElement('p');
  factBoxSelector.innerHTML = ""
  funFact.textContent = queryExtract;

  factBoxSelector.appendChild(funFact)});
}



generateCitySearch();