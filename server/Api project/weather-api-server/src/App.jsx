import React, { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const WeatherForm = () => {
  const [cityName, setCityName] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("cityName", cityName);

    if (!cityName) {
      setError("Please enter a city name.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/weather-app/${cityName}`);
      setWeather(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("City not found. Please try again.");
      setWeather(null);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Weather Checker</h1>
      <form onSubmit={handleSubmit} className="d-flex mb-4 justify-content-center">
        <input
          type="text"
          placeholder="Enter city..."
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          className="form-control w-50 me-2"
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {error && <p className="text-danger text-center">{error}</p>}

      {weather && (
        <div className="text-center mt-4">
          <h2 className="text-capitalize">{weather.city}</h2>
          <p className="fs-4">{weather.temperature}°C</p>
          <p>Humidity: {weather.humidity}%</p>
          <p>Wind: {weather.wind}</p>
          <p>Feels Like: {weather.feelslike}°C</p>
          <p>Min: {weather.min}°C / Max: {weather.max}°C</p>

          {weather.image && (
            <img
              src={weather.image}
              alt="Weather"
              className="img-fluid rounded-circle mt-4"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherForm;

