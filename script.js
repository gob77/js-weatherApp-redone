document.addEventListener("DOMContentLoaded", () => {
    navigator.geolocation.getCurrentPosition(position => {
        let lat = parseFloat(position.coords.latitude).toFixed(3);
        let lon = parseFloat(position.coords.longitude).toFixed(3);
        getWeather(lat, lon);
        getForecast(lat, lon);
    });

    let icon = weather => {
        let weatherId = weather;
        if (weatherId >= 801 && weatherId <= 804) {
            return `img/80x - cloud.svg`;
        } else if (weatherId === 800) {
            return `img/800 - clear.svg`;
        } else if (weatherId >= 600 && weatherId <= 622) {
            return `img/600 - snow.svg`;
        } else if (weatherId >= 500 && weatherId <= 531) {
            return `img/500 - rain.svg`;
        } else if (weatherId >= 300 && weatherId <= 321) {
            return `img/300 - drizzle.svg`;
        } else if (weatherId >= 200 && weatherId <= 232) {
            return `img/200 - thunder.svg`;
        }
    };

    let showDate = timestamp => {
        let date = new Date(timestamp * 1000);
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();

        return `${day} / ${month < 10 ? `0` : month}${month} / ${year}`;
    };

    async function getWeather(a, b) {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${a}&lon=${b}&appid=446355c29c56f4b0eaf41493d1017d93&units=metric`);
        let data = await response.json();
        let temp = document.getElementById("temp");
        let location = document.getElementById("location");
        let date = document.getElementById("date");
        let weather = document.getElementById("weather");
        let weatherIcon = document.getElementById("weather_icon");

        weather.textContent = `${data.weather[0].main} - ${data.weather[0].description}`;

        date.textContent = showDate(data.dt);

        location.textContent = data.name;
        temp.textContent = `${Math.round(data.main.temp)}°C`;
        weatherIcon.src = icon(data.weather[0].id);
    }

    async function getForecast(a, b) {
        let forecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${a}&lon=${b}&appid=446355c29c56f4b0eaf41493d1017d93&units=metric`);
        let forecastData = await forecast.json();

        console.log(forecastData);
        let forecastList = forecastData.list;
        let forecastWeather = document.getElementsByClassName("forecast-weather");
        let forecastTemp = document.getElementsByClassName("forecast-temp");
        let forecastDate = document.getElementsByClassName("forecast-date");
        let forecastImg = document.getElementsByClassName("forecast-img");

        for (let i = 0; i < forecastList.length; i++) {
            if (i > 12 && i < 21) {
                console.log(forecastList[i].weather[0].id);
            }
        }

        // The function below was made in colaboration with Matias Fernandez (https://github.com/thematho)

        let currentDate = new Date();
        let nextDays = {
            /* 22 : {
                min : x,
                max: x
            } */
        };

        for (let i = 1; i < 6; i++) {
            let nextDay = new Date(currentDate.setDate(currentDate.getDate() + 1));
            nextDays[nextDay.getDate()] = {};
            forecastDate[i - 1].textContent = `${nextDay.getDate()} / ${nextDay.getMonth() < 10 ? `0` : nextDay.getMonth()}${nextDay.getMonth()} / ${nextDay.getFullYear()}`;
        }
        currentDate = new Date();

        for (let i = 0; i < forecastList.length; i++) {
            let date = new Date(forecastList[i].dt * 1000);
            if (currentDate.getDate() != date.getDate()) {
                nextDays[date.getDate()].min = nextDays[date.getDate()].min == null ? forecastList[i].main.temp_min : nextDays[date.getDate()].min < forecastList[i].main.temp_min ? nextDays[date.getDate()].min : forecastList[i].main.temp_min;

                nextDays[date.getDate()].max = nextDays[date.getDate()].max == null ? forecastList[i].main.temp_max : nextDays[date.getDate()].max > forecastList[i].main.temp_max ? nextDays[date.getDate()].max : forecastList[i].main.temp_max;

                nextDays[date.getDate()].weather = nextDays[date.getDate()].weather == null ? forecastList[i].weather[0].main : nextDays[date.getDate()].weather < forecastList[i].weather[0].main ? nextDays[date.getDate()].weather : forecastList[i].weather[0].main;

                nextDays[date.getDate()].description = nextDays[date.getDate()].description == null ? forecastList[i].weather[0].description : nextDays[date.getDate()].description < forecastList[i].weather[0].description ? nextDays[date.getDate()].description : forecastList[i].weather[0].description;

                nextDays[date.getDate()].id = nextDays[date.getDate()].id == null ? forecastList[i].weather[0].id : nextDays[date.getDate()].id > forecastList[i].weather[0].id ? nextDays[date.getDate()].id : forecastList[i].weather[0].id;
            }
        }

        console.log(nextDays);

        // The function above was made in colaboration with Matias Fernandez (https://github.com/thematho)

        let counter = 0;
        for (keys in nextDays) {
            forecastTemp[counter].textContent = `Min: ${Math.round(nextDays[keys].min)}°C - Max: ${Math.round(nextDays[keys].max)}°C`;
            forecastImg[counter].src = icon(nextDays[keys].id);
            forecastWeather[counter].textContent = `${nextDays[keys].weather} - ${nextDays[keys].description}`;
            counter++;
        }
    }
});
