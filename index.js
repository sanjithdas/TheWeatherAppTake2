const express = require('express');
const Datastore = require('nedb');
var cors = require('cors');
const fetch = require('node-fetch')
//12. require dotenv and load the config
require('dotenv').config()
//13. Create a new text file called .env in the main directory
//14. Open .env and add API_KEY=199783c48455f031ccab8f8fc0110b10 with your API key 
//console.log(process.env)
//15. If you run the server you should now see the env variable in the console

const app = express();
app.use(cors())
app.options('*', cors()); 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//15a. Lets also get the port from an env variable if it has one.
const port = process.env.PORT || 3000
//15b. Then set the server to start on that port
app.listen(port, () => console.log(`listening at ${port}`));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));


const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });
});

app.post('/api', (request, response) => {
  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  database.insert(data);
  response.json(data);
});

app.get('/weather/:latlon', async(request, response) => {
  console.log(request.param.latlon);
  const latlon = request.params.latlon.split(',');
  const lat = latlon[0]
  const lon = latlon[1]
  
  try{
    //16. We can now load and use the env variable in our code
    const api_key = process.env.API_KEY
    //let weatherAPI = `https://api.darksky.net/forecast/${api_key}/${lat},${lon}/?units=si`
    let weatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`
        //17. Test the application and check the app still works
    //18. Now the env variable is still in a file .env
    //19. We want to sync this up to GitHub but we do not want to publish our API key to GitHub
    //20. Create a new file in the main directory called .env_sample. Add the following API_KEY=YOUR_API_KEY_HERE
    //21. Now we need to tell our .gitignore to ingnore .env
    //22. If you have not already created a .gitignore file in you main directory create this file and add: .env 
    //23. Sync your project up to gitHub.
    //24. Check on gitHub
    //25. Done!

    const weatherData = await fetch(weatherAPI)
    const weather = await weatherData.json()

    let airAPI = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`
    const airData = await fetch(airAPI)
    const air = await airData.json()

    const data = {
      weather: weather,
      air: air
    }
    console.log(data)
    response.json(data)
  } catch(error){
    console.log(error)
  }
  
});