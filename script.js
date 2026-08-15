
// GET HTML ELEMENTS
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const weatherContainer =
    document.getElementById("weatherContainer");

const loading =
    document.getElementById("loading");

const error =
    document.getElementById("error");

const errorText =
    document.getElementById("errorText");

// WEATHER ELEMENTS
const cityName =
    document.getElementById("cityName");

const country =
    document.getElementById("country");

const temperature =
    document.getElementById("temperature");

const feelsLike =
    document.getElementById("feelsLike");

const description =
    document.getElementById("description");

const weatherIcon =
    document.getElementById("weatherIcon");

const humidity =
    document.getElementById("humidity");

const windSpeed =
    document.getElementById("windSpeed");

const pressure =
    document.getElementById("pressure");

const visibility =
    document.getElementById("visibility");

const sunrise =
    document.getElementById("sunrise");

const sunset =
    document.getElementById("sunset");

const lastUpdated =
    document.getElementById("lastUpdated");

// BACKEND URL
const API_BASE_URL = "http://127.0.0.1:5000";

// SHOW / HIDE FUNCTIONS

function showLoading() {

    if (loading) {
        loading.style.display = "block";
    }

    if (error) {
        error.style.display = "none";
    }

    if (weatherContainer) {
        weatherContainer.style.display = "none";
    }
}


function hideLoading() {

    if (loading) {
        loading.style.display = "none";
    }
}


function showError(message) {

    hideLoading();

    if (weatherContainer) {
        weatherContainer.style.display = "none";
    }

    if (errorText) {
        errorText.textContent = message;
    }

    if (error) {
        error.style.display = "block";
    }
}
// DISPLAY WEATHER
function displayWeather(data) {

    hideLoading();

    if (error) {
        error.style.display = "none";
    }

    if (weatherContainer) {
        weatherContainer.style.display = "block";
    }


    if (cityName) {
        cityName.textContent = data.city;
    }

    if (country) {
        country.textContent = data.country;
    }

    if (temperature) {
        temperature.textContent =
            `${Math.round(data.temperature)}`;
    }

    if (feelsLike) {
        feelsLike.textContent =
            `${Math.round(data.feelsLike)}`;
    }

    if (description) {
        description.textContent =
            data.description;
    }

    if (weatherIcon) {
        weatherIcon.src = data.icon;
        weatherIcon.alt = data.description;
    }

    if (humidity) {
        humidity.textContent =
            `${data.humidity}`;
    }

    if (windSpeed) {
        windSpeed.textContent =
            `${data.windSpeed}`;
    }

    if (pressure) {
        pressure.textContent =
            `${data.pressure}`;
    }

    if (visibility) {
        visibility.textContent =
            `${data.visibility}`;
    }

    if (sunrise) {
        sunrise.textContent =
            data.sunrise;
    }

    if (sunset) {
        sunset.textContent =
            data.sunset;
    }

    if (lastUpdated) {
        lastUpdated.textContent =
            data.lastUpdated;
    }
}
// SEARCH WEATHER BY CITY
async function getWeatherByCity(city) {

    if (!city || city.trim() === "") {

        showError("Please enter a city name.");

        return;
    }


    showLoading();


    try {

        const response = await fetch(
            `${API_BASE_URL}/api/weather/city?city=${encodeURIComponent(city)}`
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.error || "Unable to get weather data."
            );

        }


        displayWeather(data);

    }

    catch (err) {

        console.error(err);

        showError(
            err.message ||
            "Unable to connect to the weather server."
        );

    }

}

// SEARCH BUTTON
searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    getWeatherByCity(city);

});
// ENTER KEY SEARCH

cityInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        const city = cityInput.value.trim();

        getWeatherByCity(city);

    }

});
// GET WEATHER USING LOCATION

locationBtn.addEventListener("click", () => {

    if (!navigator.geolocation) {

        showError(
            "Geolocation is not supported by your browser."
        );

        return;
    }


    showLoading();


    navigator.geolocation.getCurrentPosition(

        async (position) => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            try {

                const response = await fetch(
                    `${API_BASE_URL}/api/weather/location?lat=${latitude}&lon=${longitude}`
                );


                const data = await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.error ||
                        "Unable to get weather data."
                    );

                }


                displayWeather(data);

            }

            catch (err) {

                console.error(err);

                showError(
                    err.message ||
                    "Unable to get weather for your location."
                );

            }

        },


        (geoError) => {

            hideLoading();


            if (geoError.code === 1) {

                showError(
                    "Location permission was denied. You can search for a city instead."
                );

            }

            else if (geoError.code === 2) {

                showError(
                    "Your location could not be determined."
                );

            }

            else {

                showError(
                    "Unable to get your current location."
                );

            }

        }

    );

});