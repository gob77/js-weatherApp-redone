document.addEventListener("DOMContentLoaded", () => {
    let search = document.getElementById("city");
    search.addEventListener("keydown", event => {
        if (event.keyCode === 13) {
            event.preventDefault();
        }
    });

    let testW = window.matchMedia("(max-width: 600px)");

    function testing() {
        if (testW.matches === true) {
            console.log("width is less than 600 pixels");
        } else {
            console.log("width is more than 600 pixels");
        }
    }

    testW.addListener(testing);

    let loading_screen = pleaseWait({
        logo: "css/img/loading.gif",
        backgroundColor: "#E3F2FD",
        loadingHtml: `
        <div class='sk-spinner sk-spinner-wave'>
            <div class='sk-rect1'></div>
            <div class='sk-rect2'></div>
            <div class='sk-rect3'></div>
            <div class='sk-rect4'></div>
            <div class='sk-rect5'></div>
        </div>`,
        template: `
        <div class='pg-loading-inner'>
            <div class='pg-loading-center-outer'>
                <div class='pg-loading-center-middle'>
                    <h1 class='pg-loading-logo-header'>
                        <img class='pg-loading-logo'></img>
                    </h1>
                    <h1>Please Wait</h1>
                    <div class='pg-loading-html'></div>
                </div>
            </div>
        </div`
    });

    navigator.geolocation.getCurrentPosition(position => {
        let lat = parseFloat(position.coords.latitude).toFixed(3);
        let lon = parseFloat(position.coords.longitude).toFixed(3);
        getWeather(lat, lon);
        getForecast(lat, lon);
    });

    let icon = weather => {
        let weatherId = weather;
        if (weatherId >= 801 && weatherId <= 804) {
            return `./css/img/80x - cloud.svg`;
        } else if (weatherId === 800) {
            return `./css/img/800 - clear.svg`;
        } else if (weatherId >= 600 && weatherId <= 622) {
            return `./css/img/600 - snow.svg`;
        } else if (weatherId >= 500 && weatherId <= 531) {
            return `./css/img/500 - rain.svg`;
        } else if (weatherId >= 300 && weatherId <= 321) {
            return `./css/img/300 - drizzle.svg`;
        } else if (weatherId >= 200 && weatherId <= 232) {
            return `./css/img/200 - thunder.svg`;
        } else if (weatherId === 741 || weatherId === 701 || weatherId === 721) {
            return `./css/img/700 - fog.svg`;
        }
    };

    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let showDate = timestamp => {
        let date = new Date(timestamp * 1000);
        let weekDay = date.getDay();
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();

        return `${days[weekDay]} - ${day < 10 ? `0${day}` : day} / ${month < 10 ? `0${month + 1}` : month + 1}`;
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
        //console.log(data);
        location.textContent = `${data.name} - ${data.sys.country}`;
        temp.textContent = `${Math.round(data.main.temp)}°C`;
        weatherIcon.src = icon(data.weather[0].id);
    }

    async function getForecast(a, b) {
        let forecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${a}&lon=${b}&appid=446355c29c56f4b0eaf41493d1017d93&units=metric`);
        let forecastData = await forecast.json();

        //console.log(forecastData);
        let forecastList = forecastData.list;
        let forecastWeather = document.getElementsByClassName("forecast-weather");
        let forecastTemp = document.getElementsByClassName("forecast-temp");
        let forecastDate = document.getElementsByClassName("forecast-date");
        let forecastImg = document.getElementsByClassName("forecast-img");

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
            let day = nextDay.getDay();
            let date = nextDay.getDate();
            let month = nextDay.getMonth() + 1;
            nextDays[nextDay.getDate()] = {};
            forecastDate[i - 1].textContent = `${days[day]} - ${date < 10 ? `0${date}` : date} / ${month < 10 ? `0${month}` : month}`;
        }
        currentDate = new Date();

        for (let i = 0; i < forecastList.length; i++) {
            // getting dates to compare an put data into de data container object
            let listDate = new Date(forecastList[i].dt * 1000);
            let date = listDate.getDate();
            let objectDate = nextDays[date];

            // getting the data
            let tempMin = Math.round(forecastList[i].main.temp_min);
            let tempMax = Math.round(forecastList[i].main.temp_max);
            let weather = forecastList[i].weather[0].main;
            let description = forecastList[i].weather[0].description;
            let iconId = forecastList[i].weather[0].id;

            if (currentDate.getDate() != date) {
                objectDate.min = objectDate.min == null ? tempMin : objectDate.min < tempMin ? objectDate.min : tempMin;

                objectDate.max = objectDate.max == null ? tempMax : objectDate.max > tempMax ? objectDate.max : tempMax;

                objectDate.weather = objectDate.weather == null ? weather : objectDate.weather < weather ? objectDate.weather : weather;

                objectDate.description = objectDate.description == null ? description : objectDate.description;

                objectDate.id = objectDate.id == null ? iconId : objectDate.id;
            }
        }

        /* let currentDate = new Date();
        let nextDays = {
            /* 22 : {
                min : x,
                max: x
            } 
        };

        for (let i = 1; i < 6; i++) {
            let nextDay = new Date(currentDate.setDate(currentDate.getDate() + 1));
            nextDays[nextDay.getDate()] = {};
            forecastDate[i - 1].textContent = `${days[nextDay.getDay()]} - ${nextDay.getDate()} / ${nextDay.getMonth() < 10 ? `0` : nextDay.getMonth() + 1}${nextDay.getMonth() + 1}`;
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


        } */

        // The function above was made in colaboration with Matias Fernandez (https://github.com/thematho)

        let counter = 0;
        for (keys in nextDays) {
            let objectKey = nextDays[keys];
            let temperature = forecastTemp[counter];
            let img = forecastImg[counter];
            let weather = forecastWeather[counter];

            temperature.textContent = `Min: ${objectKey.min}°C / Max: ${objectKey.max}°C`;

            img.src = icon(objectKey.id);

            weather.textContent = `${objectKey.weather} - ${objectKey.description}`;

            counter++;
        }
    }
    let location;

    async function getCity(city) {
        location = city;
        let cityTemp = document.getElementById("city-temp");
        let cityWeather = document.getElementById("city-weather");
        let cityDate = document.getElementById("city-date");
        let cityIcon = document.getElementById("city-icon");
        let body = document.getElementById("modal-body");
        let title = document.getElementById("modal-title");

        let cityResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=446355c29c56f4b0eaf41493d1017d93&units=metric`);
        let cityData = await cityResponse.json();

        if (cityData.cod === "404") {
            title.textContent = "Error";
            body.textContent = cityData.message;
            document.getElementById("city").value = "";
        } else {
            title.textContent = `Showing Weather for: ${cityData.name} - ${cityData.sys.country}`;
            cityTemp.textContent = `${Math.round(cityData.main.temp)}°C`;
            cityWeather.textContent = `${cityData.weather[0].main} - ${cityData.weather[0].description}`;
            cityDate.textContent = `${showDate(cityData.dt)}`;
            cityIcon.src = icon(cityData.weather[0].id);
            document.getElementById("city").value = "";
        }
    }

    async function getCityForecast() {
        let cityForecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=446355c29c56f4b0eaf41493d1017d93&units=metric`);
        let forecastData = await cityForecast.json();

        let cityList = forecastData.list;

        console.log(forecastData.list);

        let currentDate = new Date();
        let forecastDays = {
            /* 22 : {
                min : x,
                max: x
            } */
        };

        for (let i = 1; i < 6; i++) {
            let nextDay = new Date(currentDate.setDate(currentDate.getDate() + 1));
            forecastDays[nextDay.getDate()] = {};
        }
        currentDate = new Date();

        for (let i = 0; i < cityList.length; i++) {
            // getting dates to compare an put data into de data container object
            let listDate = new Date(cityList[i].dt * 1000);
            let date = listDate.getDate();
            let objectDate = forecastDays[date];

            let tempMin = Math.round(cityList[i].main.temp_min);
            let tempMax = Math.round(cityList[i].main.temp_max);
            let weather = cityList[i].weather[0].main;
            let description = cityList[i].weather[0].description;
            let iconId = cityList[i].weather[0].id;

            if (currentDate.getDate() != date) {
                objectDate.min = objectDate.min == null ? tempMin : objectDate.min < tempMin ? objectDate.min : tempMin;

                objectDate.max = objectDate.max == null ? tempMax : objectDate.max > tempMax ? objectDate.max : tempMax;

                objectDate.weather = objectDate.weather == null ? weather : objectDate.weather < weather ? objectDate.weather : weather;

                objectDate.description = objectDate.description == null ? description : objectDate.description;

                objectDate.id = objectDate.id == null ? iconId : objectDate.id;
            }
        }
        console.log(forecastDays);
    }

    let cityForecast = document.getElementById("city-forecast");
    cityForecast.addEventListener("click", getCityForecast);

    let cityBtn = document.getElementById("citybtn");
    cityBtn.addEventListener("click", () => {
        let city = document.getElementById("city").value;
        if (city === "") {
            event.stopPropagation();
            console.log(city);
        } else {
            getCity(city);
        }
    });

    $("#sharedModal").modal({ backdrop: "static", show: false });

    loading_screen.finishing = true;
});
