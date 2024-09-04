import "./App.css";
import clearskyIcon from "./assets/clearsky.png";
import cloudIcon from "./assets/cloud.png";
import drizzleIcon from "./assets/drizzle.png";
import humidityIcon from "./assets/humidity.png";
import rainyIcon from "./assets/rainy.png";
import snowIcon from "./assets/snow.png";
import windIcon from "./assets/wind.png";
import searchIcon from "./assets/search.png";
import brokencloudsIcon from "./assets/brokenclouds.png";
import mistIcon from "./assets/mist.png";
import scatteredIcon from "./assets/scattered.png";
import thunderstromIcon from "./assets/thunderstrom.png";
import oopsIcon from './assets/oops.png'
import { useEffect, useState } from "react";

const WeatherDetails = ({
  icon,
  temp,
  city,
  country,
  lat,
  long,
  humidity,
  windspeed,
}) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="clearsky" id="weatherimg" />
      </div>
      <div className="weatherdata mt-2">
        <div className="row flex-column">
          <div className="col mt-2">
            <h1>{temp}°C</h1>
          </div>
          <div className="col mt-2">
            <h1>{city}</h1>
          </div>
          <div className="col mt-2">
            <h3>{country}</h3>
          </div>
        </div>
        <div className="row justify-content-center mt-2">
          <div className="col-6 p-0 m-0 mt-3">
            <h3>Latitude</h3>
            <h5>{lat}</h5>
          </div>
          <div className="col-6 p-0 m-0 mt-3">
            <h3>Longitude</h3>
            <h5>{long}</h5>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col">
            <img src={humidityIcon} className="weatherdata-img" alt="" />
            <h4>{humidity}%</h4>
            <h5>Humidity</h5>
          </div>
          <div className="col">
            <img src={windIcon} className="weatherdata-img" alt="" />
            <h4>{windspeed} km/h</h4>
            <h5>Wind Speed</h5>
          </div>
        </div>
      </div>
    </>
  );
};
const App = () => {
  const [text, setText] = useState("Chennai");
  const [icon, setIcon] = useState();
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("IN");
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [windspeed, setWindspeed] = useState(0);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": clearskyIcon,
    "02d": cloudIcon,
    "03d": scatteredIcon,
    "04d": brokencloudsIcon,
    "09d": rainyIcon,
    "10d": rainyIcon,
    "11d": thunderstromIcon,
    "13d": snowIcon,
    "50d": mistIcon,
  };

  const apiKey = "5131a1d96088f3dec849186e13a604e4";
  async function api() {
    setLoading(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apiKey}&units=Metric`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.cod === "404") {
        console.log("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLong(data.coord.lon);
      setHumidity(data.main.humidity);
      setWindspeed(data.wind.speed);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearskyIcon);
      setCityNotFound(false);
    } catch (error) {
      console.log("error not able to display", error);
      setError(" An Error occured while fetching wearher data!");
    } finally {
      setLoading(false);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      api();
    }
  };

  useEffect(function () {
    api();
  }, []);
  return (
    <>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-4 p-0">
            <div className="card">
              <div className="card-body">
                <div className="container">
                  <div className="header mt-2">
                    <div className="row">
                      <h1 className="title">SKYFORECAST</h1>
                    </div>
                    <div className="row">
                      <div className="col-11 p-0">
                        <input
                          type="text"
                          className="form-control"
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Search..."
                        />
                      </div>
                      <div className="col-1 p-0">
                        <img
                          src={searchIcon}
                          id="searchIcon"
                          alt="🔍"
                          onClick={api}
                        />
                      </div>
                    </div>
                  </div>
                  <main>
                   {!loading && !cityNotFound && <WeatherDetails
                      icon={icon}
                      temp={temp}
                      city={city}
                      country={country}
                      lat={lat}
                      long={long}
                      humidity={humidity}
                      windspeed={windspeed}
                    ></WeatherDetails>}
                  </main>
                 {loading && <div className="loading-message text-warning my-5">
                    <h1>Loading...</h1>
                  </div>}
                  {error && <div className="error-message">{error}</div>}
                  { cityNotFound && <div className="city-not-found text-warning">
                    <img src={oopsIcon} className="oopsimg" alt="OOPS..." />
                    <h1>City not found</h1>
                  </div>}
                  <footer>
                    <hr />
                    <p className="m-0 p-0 text-white">
                      SkyForecast<span> © 2024</span>
                    </p>
                  </footer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
