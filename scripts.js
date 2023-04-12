// Set the API endpoint
let factBoxSelector = document.getElementById('facts');
const queryCity =  "oakland"
let queryExtract = ""
const wikiURL = "https://en.wikipedia.org/api/rest_v1/page/summary/"

// Make the API request
fetch(wikiURL + queryCity + "?redirect=true")  
.then(function(response) {
    return response.json()
  })
.then(function(response) {
  queryExtract = response.extract
  console.log(queryExtract)
  let funFact = document.createElement('p');
  funFact.textContent = queryExtract;
  factBoxSelector.appendChild(funFact);
})