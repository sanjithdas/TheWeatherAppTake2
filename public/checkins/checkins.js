//Sets up the map
const mymap = L.map('Map').setView([0, 0], 2);
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

//Gets the data from the API and displays it
async function getData() {
  const response = await fetch('http://localhost:3000/api');
  const data = await response.json();
  console.log(data)
  for(item of data) {
      const marker = L.marker([item.lat, item.lon]).addTo(mymap)
      console.log(item.weather);
      let txt = `
      <div>
        <b>latitude:</b> <span id="latitude"></span>${item.lat} &deg;<br />
        <b>longitude:</b> <span id="longitude"></span>${item.lat} &deg;
      </div>
      <div>
        <b>The weather here is:</b>
        <span id="weather-summary">${item.weather.summary}</span> 
        <span id="weather-temperature">${item.weather.temperature} &deg;C</span> 
      </div>
      `

      if (item.air != null ){
        txt +=  `
        <div>
          <b>The concentration of particulate matter:</b>
          <span id="air-value">${item.air.value}</span> 
          <span id="air-units">${item.air.unit}</span> last read on
          <span id="air-date">${item.air.lastUpdated}</span> 
        </div>  
        `
      }else {
        txt +=  `
        <div>
          No air quality Data
        </div>  
        `
      }

      marker.bindPopup(txt)

  }


}
getData();