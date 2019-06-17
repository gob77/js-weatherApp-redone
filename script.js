document.addEventListener("DOMContentLoaded", () => {
    let h = document.getElementsByClassName("card-body")[1];
    let c_h = document.getElementsByClassName("card")[1];
    console.log(window.getComputedStyle(h).height);
    console.log(`card${window.getComputedStyle(c_h).height}`);

    navigator.geolocation.getCurrentPosition(position => {
        let lat = parseFloat(position.coords.latitude).toFixed(2);
        let lon = parseFloat(position.coords.longitude).toFixed(2);
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

    async function getWeather(a, b) {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${a}&lon=${b}&appid=446355c29c56f4b0eaf41493d1017d93&units=metric`);
        let data = await response.json();
        //console.log(data);
        let temp = document.getElementById("temp");
        let location = document.getElementById("location");
        let date = document.getElementById("date");
        let weather = document.getElementById("weather");
        let weatherIcon = document.getElementById("weather_icon");

        weather.textContent = `${data.weather[0].main} - ${data.weather[0].description}`;

        let showDate = () => {
            let date = new Date(data.dt * 1000);
            let day = date.getDate();
            let month = date.getMonth();
            let year = date.getFullYear();

            return `${day}/${month}/${year}`;
        };

        date.textContent = showDate();

        console.log(data);

        location.textContent = data.name;
        temp.textContent = `${parseInt(data.main.temp)}°C`;
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

        // check later if the function below is right

        let test = () => {
            let tempStore = [];

            for (var i = 1; i < forecastList.length; i++) {
                if (i % 8 === 0 || i === 39) {
                    tempStore.push(forecastList[i]);
                }
            }

            for (let i = 0; i < forecastTemp.length; i++) {
                console.log(tempStore[i].weather[0].id);
                let date = new Date(tempStore[i].dt * 1000);
                forecastTemp[i].textContent = `Min ${parseInt(tempStore[i].main.temp)}°C`;
                forecastDate[i].textContent = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
                forecastImg[i].src = icon(tempStore[i].weather[0].id);
                forecastWeather[i].textContent = `${tempStore[i].weather[0].main} - ${tempStore[i].weather[0].description}`;
            }
            //alert("data fully loaded");
        };
        test();
    }
});
