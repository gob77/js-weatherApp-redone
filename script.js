document.addEventListener("DOMContentLoaded", () => {
    let search = document.getElementsByClassName("form-control");
    let searchBTN = document.getElementsByClassName("search");

    let preventReaload = () => {
        for (let i = 0; i < search.length; i++) {
            search[i].addEventListener("keydown", event => {
                if (event.keyCode === 13) {
                    event.preventDefault();
                }
            });
            searchBTN[i].addEventListener("click", getcity);
        }
    };

    let forecastBTN = document.getElementById("city-forecast");
    forecastBTN.addEventListener("click", getCityForecast);

    preventReaload();

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

    let forecastTest = list => {
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
        }
        currentDate = new Date();

        for (let i = 0; i < list.length; i++) {
            // getting dates to compare an put data into de data container object
            let listDate = new Date(list[i].dt * 1000);
            let date = listDate.getDate();
            let objectDate = nextDays[date];

            // getting the data
            let tempMin = Math.round(list[i].main.temp_min);
            let tempMax = Math.round(list[i].main.temp_max);
            let weather = list[i].weather[0].main;
            let description = list[i].weather[0].description;
            let iconId = list[i].weather[0].id;
            let dt = list[i].dt;

            if (currentDate.getDate() != date) {
                objectDate.min = objectDate.min == null ? tempMin : objectDate.min < tempMin ? objectDate.min : tempMin;

                objectDate.max = objectDate.max == null ? tempMax : objectDate.max > tempMax ? objectDate.max : tempMax;

                objectDate.weather = objectDate.weather == null ? weather : objectDate.weather < weather ? objectDate.weather : weather;

                objectDate.description = objectDate.description == null ? description : objectDate.description;

                objectDate.id = objectDate.id == null ? iconId : objectDate.id;

                objectDate.dt = objectDate.dt == null ? dt : objectDate.dt;
            }
        }
        return nextDays;
    };

    async function getForecast(a, b) {
        let forecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${a}&lon=${b}&appid=446355c29c56f4b0eaf41493d1017d93&units=metric`);
        let forecastData = await forecast.json();

        //console.log(forecastData);
        let forecastList = forecastData.list;
        let forecastWeather = document.getElementsByClassName("forecast-weather");
        let forecastTemp = document.getElementsByClassName("forecast-temp");
        let forecastDate = document.getElementsByClassName("forecast-date");
        let forecastImg = document.getElementsByClassName("forecast-img");

        let data = forecastTest(forecastList);

        let counter = 0;
        for (keys in data) {
            let objectKey = data[keys];
            let temperature = forecastTemp[counter];
            let img = forecastImg[counter];
            let weather = forecastWeather[counter];
            let date = forecastDate[counter];

            temperature.textContent = `Min: ${objectKey.min}°C / Max: ${objectKey.max}°C`;

            img.src = icon(objectKey.id);

            weather.textContent = `${objectKey.weather} - ${objectKey.description}`;

            date.textContent = showDate(objectKey.dt);

            counter++;
        }
    }
    let location;

    async function searchCity(city) {
        console.log(location);
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
            //cityIcon.src = icon(cityData.weather[0].id);
            document.getElementById("city").value = "";
        }
    }

    async function getCityForecast() {
        let cityForecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=446355c29c56f4b0eaf41493d1017d93&units=metric`);
        let forecastData = await cityForecast.json();

        let cityImg = document.getElementsByClassName("cityForecast-img");
        let cityWeather = document.getElementsByClassName("cityForecast-weather");
        let cityTemp = document.getElementsByClassName("cityForecast-temp");
        let cityDate = document.getElementsByClassName("cityForecast-date");
        let cityTitle = document.getElementById("cityForecast-title");

        cityTitle.textContent = `Showing forecast for: ${location}`;
        cityTitle.style.textTransform = "capitalize";

        let cityList = forecastData.list;

        console.log(forecastData.list);

        let data = forecastTest(cityList);

        console.log(data);

        let counter = 0;
        for (keys in data) {
            let objectKey = data[keys];
            let temperature = cityTemp[counter];
            let img = cityImg[counter];
            let weather = cityWeather[counter];
            let date = cityDate[counter];

            temperature.textContent = `Min: ${objectKey.min}°C / Max: ${objectKey.max}°C`;

            img.src = icon(objectKey.id);

            weather.textContent = `${objectKey.weather} - ${objectKey.description}`;

            date.textContent = showDate(objectKey.dt);

            counter++;
        }
    }

    function getcity(event) {
        let city = document.getElementById("city").value;
        let mobileCity = document.getElementById("searchForMobile").value;
        if (event.target.id === "citybtn") {
            location = city;
            searchCity();
        } else if (event.target.id === "mobile-search" && mobileCity != "") {
            location = mobileCity;
            searchCity();
        }
    }

    $("#sharedModal").modal({ backdrop: "static", show: false });

    loading_screen.finishing = true;
});
