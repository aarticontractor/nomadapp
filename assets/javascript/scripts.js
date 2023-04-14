const apiKey = "20f9a6ae4f100c34e7ae026eafd6150d";
var cityName = document.getElementById("city-input");
const setCity = document.getElementById("city-name");
var searchCity = document.getElementById("search-city");
let factBoxSelector = document.getElementById("facts");
let photoBoxSelector = document.getElementById("photo")
let queryCity = ""
let queryExtract = ""
const wikiURL = "https://en.wikipedia.org/api/rest_v1/page/summary/"
const unsplashUrl = "https://api.unsplash.com/search/photos?query="
const unsplashKey = "EN-MXfxw-2FmgE9wEoI4yOd889kOl2R6jK9TlKZuL5w"

// above code is just constant variables that we will use for api calls 
// to build the page


//below makes the list of recent searches in the local storage

const localeSettings = {};

var all_cities = JSON.parse(localStorage.getItem('top_10_cities')) || [];

var currentDay = document.getElementById("day");
var currentEmoji = document.getElementById("emoji");
var currentTemp = document.getElementById("temp");
var currentHumidity = document.getElementById("humidity");
var currentWind = document.getElementById("wind");

var all_cities = JSON.parse(localStorage.getItem('top_10_cities')) || [];

//below makes a request for the Lattitue and Longiture and uses that to search for weather conditions
function getLatLon(currentCity) {
    var apiUrl =
        "https://api.openweathermap.org/geo/1.0/direct?q=" +
        currentCity +
        "&limit=5&appid=" +
        apiKey;
    return fetch(apiUrl)
        .then(function(data) {
            return data.json();
        })
        .then(function(data) {
            var lat = data[0].lat;
            var lon = data[0].lon;
            return {
                lat,
                lon
            }; // return an object with lat and lon values
        })
        .catch(function(error) {
            console.log(error);
        });
}


//takes the respoonses from the weather api and translates it to the page

function getWeather(lat, lon) {
    var weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial"
    return fetch(weatherUrl)
        .then(function(data) {
            return data.json();
        })
        .then(function(data) {
            var city = data.city.name;
            setCity.textContent = city;
            saveCity(city);
            generateCitySearch();
            var currentDate = (data.list[0].dt_txt).split(" ")[0];
            var current = new Date(currentDate);
            console.log(current);

            const humanReadableDate = current.toDateString();
            console.log(humanReadableDate);

            
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
        .catch(function(error) {
            console.log(error);
        });
}

//saves 7 recent cities in the recent search, stored in local storage

function saveCity(cityName) {

    if (all_cities.length > 7) {
        all_cities.shift();
    }

    const index = all_cities.indexOf(cityName);
    if (index === -1) {
        all_cities.push(cityName);
    } else {
        all_cities.splice(index, 1);
        all_cities.push(cityName);
    }
    localStorage.setItem('top_10_cities', JSON.stringify(all_cities));

}

//searches the city and generates a button for use with the recent search

function generateCitySearch() {
    const container = document.querySelector('.button-container');
    container.innerHTML = '';
    const buttons = [];

    for (let i = 0; i < all_cities.length; i++) {
        const button = document.createElement('button');
        button.textContent = all_cities[i];
        button.id = 'button' + (i + 1);
        button.className = 'button is-success';
        button.addEventListener('click', function() {
            const cityButton = this.textContent;
            setCity.textContent = cityButton;
            factboxUpdater(cityButton)
            getPhoto(cityButton);
            saveCity(cityButton);
            getLatLon(cityButton).then(function(data) {
                var lat = data.lat;
                var lon = data.lon;

                getWeather(lat, lon);

            });
        });
        buttons.push(button);
        container.appendChild(button);
        container.appendChild(document.createElement("br"));
    }
}

//adds click functionality to all buttons for search
searchCity.addEventListener("click", function() {
    event.preventDefault();
    var currentCity = cityName.value;
    factboxUpdater(currentCity);
    getPhoto(currentCity);
    getLatLon(currentCity).then(function(data) {
        var lat = data.lat;
        var lon = data.lon;

        getWeather(lat, lon);

    });
});

//updates the fun fact box by making a call to the wikipedia api
function factboxUpdater(queryCity) {
    fetch(wikiURL + queryCity + "?redirect=true")
        .then(function(response) {
            return response.json()
        })
        .then(function(response) {
            queryExtract = response.extract
            let funFact = document.createElement('p');
            factBoxSelector.innerHTML = ""
            funFact.textContent = queryExtract;

            factBoxSelector.appendChild(funFact)
        });
}

//generates photos for each city and appends them to the page 
function getPhoto(cityName) {
    var photoUrl = unsplashUrl + cityName + "&client_id=" + unsplashKey;
    fetch(photoUrl)
        .then(function(data) {
            return data.json();
        })
        .then(function(data) {
            var photoUrl = data.results[0].urls.raw;
            let addPhoto = document.createElement('img');
            addPhoto.src = photoUrl;
            photoBoxSelector.appendChild(addPhoto);

        });
}



generateCitySearch();