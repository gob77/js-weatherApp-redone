let test = document.getElementById("temp");
let value = test.textContent;
console.log(value);

document.addEventListener("DOMContentLoaded", () => {
    let test = document.getElementById("temp");
    console.log(test.textContent);
    let loading_screen = pleaseWait({
        logo: "img/loading1.gif",
        backgroundColor: "#E3F2FD",
        //loadingHtml: "<div class='rect1'></div><div class='rect2'></div><div class='rect3'></div><div class='rect4'></div><div class='rect5'></div>",
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
        } else if (weatherId === 741 || weatherId === 701) {
            return `img/700 - fog.svg`;
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
        console.log(data);
        location.textContent = `${data.name} - ${data.sys.country}`;
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

    loading_screen.finishing = true;
});
