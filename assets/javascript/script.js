// Replace with your Foursquare Client ID and Client Secret
const clientId = "SCKSPCQ5R4WTJRTMHAQY1FVMCQBUWLH5IUHMDRUHB5XJA0J3";
const clientSecret = "AYYM2QFVMFDI2FOEKP1PZ30TVFWE55BAO4ZE01ZH1JJ1ZBYW";

// Select the search input and search button elements from the HTML
const searchInput = document.querySelector(".input");
const searchButton = document.querySelector(".button");

// Select the place elements from the HTML
const places = document.querySelectorAll(".tile .notification.box.is-lite");

// Add a click event listener to the search button
searchButton.addEventListener("click", () => {
  searchCity(searchInput.value);
  console.log("click button test")
});

// Function to search for city venues
function searchCity(city) {
  // Set the Foursquare API endpoint and parameters
  const endpoint = "https://api.foursquare.com/v2/venues/explore";
  const params = new URLSearchParams({
    near: city,
    client_id: clientId,
    client_secret: clientSecret,
    v: "20210401", // API version (date format: YYYYMMDD)
    limit: 5, // Limit results to 5
  });

  // Make the API request
  fetch(`${endpoint}?${params}`)
    .then(response => response.json())
    .then(data => {
      // Check if the request was successful
      if (data.meta.code === 200) {
        // Get the venue items from the response
        const items = data.response.groups[0].items;
        // Loop through the items and update the place information
        items.forEach((item, index) => {
          updatePlaceInfo(item.venue, index);
        });
      } else {
        console.error("Error fetching city search results:", data.meta.errorDetail);
      }
    })
    .catch(error => {
      console.error("Error making the API request:", error);
    });
}

// Function to update the place information (name and address)
function updatePlaceInfo(venue, index) {
  const placeElement = places[index];

  // Update title and subtitle
  placeElement.querySelector(".title").textContent = venue.name;
  placeElement.querySelector(".subtitle").textContent = venue.location.address;

  // Get photo for the venue
  getVenuePhoto(venue.id, index);

  // Remove content
  placeElement.querySelector(".content").innerHTML = "";
}

// Function to get a photo for a venue
function getVenuePhoto(venueId, index) {
  // Set the Foursquare API endpoint and parameters for fetching venue photos
  const endpoint = `https://api.foursquare.com/v2/venues/${venueId}/photos`;
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    v: "20210401", // API version (date format: YYYYMMDD)
    limit: 1, // Limit results to 1
  });

  // Make the API request
  fetch(`${endpoint}?${params}`)
    .then(response => response.json())
    .then(data => {
      // Check if the request was successful and if there are any photos
      if (data.meta.code === 200 && data.response.photos.count > 0) {
        // Get the first photo from the response
        const photo = data.response.photos.items[0];
        // Construct the photo URL using the response data
        const photoUrl = `${photo.prefix}${photo.width}x${photo.height}${photo.suffix}`;
        // Update the place element with the photo
        updatePlacePhoto(index, photoUrl);
      }
    })
    .catch(error => {
      console.error("Error fetching venue photo:", error);
    });
}

// Function to update the place element with the photo
// function updatePlacePhoto(index,
