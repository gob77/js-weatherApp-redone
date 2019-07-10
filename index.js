const express = require("express");
const app = express();

const fetch = require("node-fetch");

app.listen(3000, () => {
    console.log("listening");
});
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

app.get("/weather/:coords", async (request, response) => {
    //console.log(request.params);
    const coords = request.params.coords.split(",");
    //console.log(coords);
    const lat = coords[0];
    const lon = coords[1];
    //console.log(lat, lon);
    const currentWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=446355c29c56f4b0eaf41493d1017d93&units=metric`;

    const fetch_currentWeather = await fetch(currentWeather);
    const currentWeather_json = await fetch_currentWeather.json();

    const forecastWeather = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=446355c29c56f4b0eaf41493d1017d93&units=metric`;

    const fetch_forecastWeather = await fetch(forecastWeather);
    const forecastWeather_json = await fetch_forecastWeather.json();

    response.json({
        current: currentWeather_json,
        forecast: forecastWeather_json
    });
});
