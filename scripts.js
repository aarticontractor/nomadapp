// Set the API endpoint
const proxyurl = "https://cors-anywhere.herokuapp.com/";
const endpoint = "https://maps.googleapis.com/maps/api/place/details/json";  

// Set the parameters
const params = new URLSearchParams({
  place_id: "ChIJIQBpAG2ahYAR_6128GcTUEo",
  key: "AIzaSyCqrkaCxLtFLMq9MNrfhftNJS00FU9w95g",
});

// Make the API request
fetch(`${proxyurl}${endpoint}?${params}`)  
.then(function(response) {
    console.log(response)
    return response
  })