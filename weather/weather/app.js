const startBtn=document.querySelector(".start");
const search=document.querySelector("#inputfield");
const searchIcon=document.querySelector("#searchIcon");
const desc=document.querySelector("#desc");
const temp=document.querySelector("#temp");
const cityName=document.querySelector("#city");
const wind=document.querySelector("#windSpeed");
const humidity=document.querySelector("#humidityper");
const feelsLike=document.querySelector("#feelsLike");
const forecast1=document.querySelector("#forecast1");
const forecast2=document.querySelector("#forecast2");
const forecast3=document.querySelector("#forecast3");
const forecast1Weather=document.querySelector("#forecast1Weather");
const forecast2Weather=document.querySelector("#forecast2Weather");
const forecast3Weather=document.querySelector("#forecast3Weather");
const forecast1Humidity=document.querySelector("#forecast1Humidity");
const forecast2Humidity=document.querySelector("#forecast2Humidity");
const forecast3Humidity=document.querySelector("#forecast3Humidity");
const day1Name=document.querySelector("#day1Name");
const day2Name=document.querySelector("#day2Name");
const day3Name=document.querySelector("#day3Name");
const goHome=document.querySelector(".homeBtn");
const icon=document.querySelector("#icon");
const mainBox1=document.querySelector(".mainBox1");
const mainBox2=document.querySelector(".mainBox2");
const mainBox3=document.querySelector(".mainBox3");
const backBtn=document.querySelector("#backBtn");


startBtn.addEventListener("click",()=>{
    mainBox1.classList.add("inactive");
    mainBox2.classList.remove("inactive");
});

function mapWeatherCode(code) {
    if (code === 0) return "Clear";
    if (code === 1 || code === 2 || code === 3) return "Clouds";
    if (code >= 45 && code <= 48) return "Mist";
    if (code >= 51 && code <= 67) return "Rain"; 
    if (code >= 71 && code <= 77) return "Snow";
    if (code >= 80 && code <= 82) return "Rain";
    if (code >= 85 && code <= 86) return "Snow";
    if (code >= 95) return "Rain"; 
    return "Clear";
}

function changeIcon(weatherMain){
    let icons={
        Clouds: "clouds.png",
        Rain: "drizzle.png",
        Mist: "mist.png",
        Haze: "haze.png",
        Snow: "snow.png",
        Clear: "clear.png"
    };
    icon.src=icons[weatherMain] || "clear.png";

    const backgrounds = {
        Clear: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
        Clouds: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1400&q=80",
        Rain: "https://images.unsplash.com/photo-1438449805896-28a666819a20?auto=format&fit=crop&w=1400&q=80",
        Mist: "https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?auto=format&fit=crop&w=1400&q=80",
        Snow: "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?auto=format&fit=crop&w=1400&q=80",
        Haze: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80"
    };

    mainBox2.style.background = `linear-gradient(135deg, rgba(10, 15, 35, 0.75), rgba(30, 30, 47, 0.85)), url('${backgrounds[weatherMain] || backgrounds.Clear}') center/cover no-repeat`;
}

changeIcon("Clear");

async function getWeatherData(city) {
    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            mainBox2.classList.add("inactive");
            mainBox3.classList.remove("inactive");
            desc.innerHTML="description";
            temp.innerHTML="0°c";
            cityName.innerHTML="New York";
            wind.innerHTML="0km/h";
            humidity.innerHTML="0%";
            feelsLike.innerHTML="Feels like 0°c";
            forecast1.innerHTML="0°c";
            forecast2.innerHTML="0°c";
            forecast3.innerHTML="0°c";
            forecast1Weather.innerHTML="Clear";
            forecast2Weather.innerHTML="Clear";
            forecast3Weather.innerHTML="Clear";
            forecast1Humidity.innerHTML="0%";
            forecast2Humidity.innerHTML="0%";
            forecast3Humidity.innerHTML="0%";
            day1Name.innerHTML="Mon";
            day2Name.innerHTML="Tue";
            day3Name.innerHTML="Wed";
            search.value="";
            changeIcon("Clear");
            return;
        }

        const lat = geoData.results[0].latitude;
        const lon = geoData.results[0].longitude;
        const resolvedCity = geoData.results[0].name;

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,relative_humidity_2m_mean&timezone=auto`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        const current = weatherData.current;
        const daily = weatherData.daily;
        const weatherMain = mapWeatherCode(current.weather_code);

        desc.innerHTML = weatherMain;
        temp.innerHTML = Math.round(current.temperature_2m) + "°c";
        feelsLike.innerHTML = `Feels like ${Math.round(current.apparent_temperature)}°c`;
        cityName.innerHTML = resolvedCity;
        wind.innerHTML = current.wind_speed_10m + "km/h";
        humidity.innerHTML = current.relative_humidity_2m + "%";

        const forecastTemps = daily.temperature_2m_max.slice(1, 4).map(v => Math.round(v) + "°c");
        const forecastDays = daily.time.slice(1, 4).map(date => new Date(date).toLocaleDateString("en", { weekday: "short" }));
        const forecastWeathers = daily.weather_code.slice(1, 4).map(code => mapWeatherCode(code));
        const forecastHumidity = daily.relative_humidity_2m_mean.slice(1, 4).map(v => Math.round(v) + "%");

        forecast1.innerHTML = forecastTemps[0] || "0°c";
        forecast2.innerHTML = forecastTemps[1] || "0°c";
        forecast3.innerHTML = forecastTemps[2] || "0°c";
        forecast1Weather.innerHTML = forecastWeathers[0] || "Clear";
        forecast2Weather.innerHTML = forecastWeathers[1] || "Clear";
        forecast3Weather.innerHTML = forecastWeathers[2] || "Clear";
        forecast1Humidity.innerHTML = forecastHumidity[0] || "0%";
        forecast2Humidity.innerHTML = forecastHumidity[1] || "0%";
        forecast3Humidity.innerHTML = forecastHumidity[2] || "0%";
        day1Name.innerHTML = forecastDays[0] || "Mon";
        day2Name.innerHTML = forecastDays[1] || "Tue";
        day3Name.innerHTML = forecastDays[2] || "Wed";

        changeIcon(weatherMain);

    } catch (e) {
        console.error("Error fetching weather data:", e);
    }
}

searchIcon.addEventListener("click",()=>{
    getWeatherData(search.value);
})

search.addEventListener("keypress",(e)=>{
    if(e.key=="Enter"){
        getWeatherData(search.value); 
    }
})

goHome.addEventListener("click",()=>{
    mainBox3.classList.add("inactive");
    mainBox1.classList.remove("inactive");
    mainBox2.style.background = "linear-gradient(135deg, rgba(10, 15, 35, 0.75), rgba(30, 30, 47, 0.85)), url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80') center/cover no-repeat";
})

backBtn.addEventListener("click",()=>{
    mainBox2.classList.add("inactive");
    mainBox1.classList.remove("inactive");
    search.value="";
    desc.innerHTML="description";
    temp.innerHTML="0°c";
    cityName.innerHTML="india";
    wind.innerHTML="0km/h";
    humidity.innerHTML="0%";
    feelsLike.innerHTML="Feels like 0°c";
    forecast1.innerHTML="0°c";
    forecast2.innerHTML="0°c";
    forecast3.innerHTML="0°c";
    forecast1Weather.innerHTML="Clear";
    forecast2Weather.innerHTML="Clear";
    forecast3Weather.innerHTML="Clear";
    forecast1Humidity.innerHTML="0%";
    forecast2Humidity.innerHTML="0%";
    forecast3Humidity.innerHTML="0%";
    day1Name.innerHTML="Mon";
    day2Name.innerHTML="Tue";
    day3Name.innerHTML="Wed";
    changeIcon("Clear");
})