const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;
const API_KEY = process.env.OPENWEATHER_API_KEY;


// Middleware
app.use(cors());
app.use(express.json());


// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Weather API server is running!"
    });
});


// Get weather by city
app.get("/api/weather/city", async (req, res) => {

    try {

        const city = req.query.city;

        if (!city) {
            return res.status(400).json({
                error: "City name is required."
            });
        }

        if (!API_KEY) {
            return res.status(500).json({
                error: "Weather API key is missing."
            });
        }


        const url =
            `https://api.openweathermap.org/data/2.5/weather` +
            `?q=${encodeURIComponent(city)}` +
            `&appid=${API_KEY}` +
            `&units=metric`;


        const response = await fetch(url);

        const data = await response.json();


        if (!response.ok) {
            return res.status(response.status).json({
                error: data.message || "Unable to get weather data."
            });
        }


        res.json({

            city: data.name,

            country: data.sys.country,

            temperature: data.main.temp,

            feelsLike: data.main.feels_like,

            description: data.weather[0].description,

            icon:
                `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,

            humidity: data.main.humidity,

            windSpeed:
                Math.round(data.wind.speed * 3.6),

            pressure: data.main.pressure,

            visibility:
                (data.visibility / 1000).toFixed(1),

            sunrise:
                new Date(data.sys.sunrise * 1000)
                    .toLocaleTimeString(),

            sunset:
                new Date(data.sys.sunset * 1000)
                    .toLocaleTimeString(),

            dateTime:
                new Date().toLocaleString(),

            lastUpdated:
                new Date().toLocaleTimeString()
        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Server error while getting weather data."
        });

    }

});


// Get weather by current location
app.get("/api/weather/location", async (req, res) => {

    try {

        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({
                error: "Latitude and longitude are required."
            });
        }

        if (!API_KEY) {
            return res.status(500).json({
                error: "Weather API key is missing."
            });
        }


        const url =
            `https://api.openweathermap.org/data/2.5/weather` +
            `?lat=${encodeURIComponent(lat)}` +
            `&lon=${encodeURIComponent(lon)}` +
            `&appid=${API_KEY}` +
            `&units=metric`;


        const response = await fetch(url);

        const data = await response.json();


        if (!response.ok) {
            return res.status(response.status).json({
                error: data.message || "Unable to get weather data."
            });
        }


        res.json({

            city: data.name,

            country: data.sys.country,

            temperature: data.main.temp,

            feelsLike: data.main.feels_like,

            description: data.weather[0].description,

            icon:
                `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,

            humidity: data.main.humidity,

            windSpeed:
                Math.round(data.wind.speed * 3.6),

            pressure: data.main.pressure,

            visibility:
                (data.visibility / 1000).toFixed(1),

            sunrise:
                new Date(data.sys.sunrise * 1000)
                    .toLocaleTimeString(),

            sunset:
                new Date(data.sys.sunset * 1000)
                    .toLocaleTimeString(),

            dateTime:
                new Date().toLocaleString(),

            lastUpdated:
                new Date().toLocaleTimeString()
        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Server error while getting weather data."
        });

    }

});
// Start server
// Start server
const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Weather server running on port ${PORT}`);
});

server.on("error", (error) => {
    console.error("SERVER ERROR:", error);
});