const mymap = L.map('Map').setView([0, 0], 2) //Holds a reference to the map
let weather, air //Stores the weather and air quality data from the API
let marker  //Stores a reference to the marker
let markerText = '' //Stores the marker text
let currentCoords //Stores the users coords

//Sets up the map and loads the tiles
function mapSetup(){
  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const tiles = L.tileLayer(tileUrl, { attribution });
  tiles.addTo(mymap);
}

//Gets the users current coords
function getCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

//Starts the app and passess the coords to displayLocation() and the apiCall()
async function init(){
  if ('geolocation' in navigator) {
    console.log('geolocation available')
      try {
        const { coords } = await getCurrentPosition()
        currentCoords = coords
        displayLocation()
        apiCall()
        
      // Handle coordinates
      } catch (error) {
          // Handle error
          console.error(error)
      }
  } else {
    console.log('geolocation not available')
  }
}

//Displays the users locaiton
function displayLocation(){
    document.getElementById('latLon').textContent = 'Latitude & longitude'
    document.getElementById('latitude').textContent = currentCoords.latitude;
    document.getElementById('longitude').textContent = currentCoords.longitude;
    mymap.setView([currentCoords.latitude, currentCoords.longitude], 5);
    marker = L.marker([currentCoords.latitude, currentCoords.longitude]).addTo(mymap)
    markerText += 
    `<div>
      <h6 class="text-primary">Your Weather</h6>
      <b>Latitude & Longitude:</b> <span id="latitude"></span>${currentCoords.latitude}, ${currentCoords.longitude} &deg;<br />
    </div>`
    marker.bindPopup(markerText)
}

//Calls the API to get the data
async function apiCall() {
      try{
        let weatherAPI = `/weather/${currentCoords.latitude},${currentCoords.longitude}`;
        const response = await fetch(weatherAPI)
        const json = await response.json()
        console.log(json)
       
        if(json.air.results.length > 0){
          air = json.air.results[0].measurements[0]
          displayAirData(air)
        }else{
          air = null
        }
        if(json.weather != null){
          weather = json.weather
          displayWeatherData(weather)
        }
        document.getElementById('submit').disabled = false;
      }catch(error){
        document.getElementById('air-value').textContent = 'No Data';
        console.log(error);
      }
}

//Displays the weather
function displayWeatherData(weather) {
  console.log('weather');
  console.log(weather);
  markerText += 
      `<div>
        <b>The weather is:</b>
        <span id="weather-summary">${weather.weather[0].main}</span> 
        <span id="weather-temperature">${weather.main.temp} &deg;C</span> 
      </div>`

  marker.bindPopup(markerText)
  document.getElementById('weather').textContent = 'The Weather'
  document.getElementById('weather-summary').textContent = weather.weather[0].main;
  document.getElementById('weather-temperature').textContent = weather.main.temp;
}

//Displays the air quality
function displayAirData(air) { 
  markerText +=  
        `<div>
          <b>Concentration of particulate</b>:
          <span id="air-value">${air.value}</span> 
          <span id="air-units">${air.unit}</span> last read on
          <span id="air-date">${air.lastUpdated}</span> 
        </div>`
  marker.bindPopup(markerText)
  document.getElementById('concentration').textContent = 'Concentration of particulate'
  document.getElementById('air-value').textContent = air.value;
  document.getElementById('air-units').textContent = air.unit;
  document.getElementById('air-date').textContent = air.lastUpdated;
}

//Submit button click event - Sends the data to the API
const button = document.getElementById('submit');
button.addEventListener('click', async event => {
    const lat = currentCoords.latitude
    const lon = currentCoords.longitude
    const data = { lat, lon, weather, air};

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    const response = await fetch('http://localhost:3000/api', options);
    const json = await response.json();
});


mapSetup()
init()





