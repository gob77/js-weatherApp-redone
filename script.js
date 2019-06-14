document.addEventListener("DOMContentLoaded", () => {
    navigator.geolocation.getCurrentPosition(position => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        getWeather(parseFloat(lat).toFixed(2), parseFloat(lon).toFixed(2));
    });

    async function getWeather(a, b) {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${a}&lon=${b}&appid=446355c29c56f4b0eaf41493d1017d93&units=metric`);
        let data = await response.json();
        console.log(data);
        let temp = document.getElementById("temp");
        let location = document.getElementById("location");
        let date = document.getElementById("date");
        let weather = document.getElementById("weather");
        let weatherIcon = document.getElementById("weather_icon");

        weather.textContent = data.weather[0].main;

        let showDate = () => {
            let date = new Date();
            let day = date.getDate();
            let month = date.getMonth();
            let year = date.getFullYear();

            return `${day}/${month}/${year}`;
        };

        date.textContent = showDate();

        let icon = () => {
            let weather = data.weather[0].id;
            if (weather >= 801 && weather <= 804) {
                return `img/80x - cloud.svg`;
            } else if (weather === 800) {
                return `img/800 - clear.svg`;
            } else if (weather >= 600 && weather <= 622) {
                return `img/600 - snow.svg`;
            } else if (weather >= 500 && weather <= 531) {
                return `img/500 - rain.svg`;
            } else if (weather >= 300 && weather <= 321) {
                return `img/300 - drizzle.svg`;
            } else if (weather >= 200 && weather <= 232) {
                return `img/200 - thunder.svg`;
            }
        };

        location.textContent = data.name;
        temp.textContent = `${parseInt(data.main.temp)}°C`;
        weatherIcon.src = icon();
    }
    // api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}
});
