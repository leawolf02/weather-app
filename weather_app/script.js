// user can search for location 
const apiKey= "9a42a837b7fde62682337a5d9a171e0c";
const apiKeyWeather = "c1d97d93da4546f08b2224837251810";
const searchBttn = document.getElementById("search");
const form = document.getElementById("form");
const gpsBttn = document.getElementById("gps");
const output = document.getElementById("location");
const autofill = document.getElementById("autofill");
let long;
let lat;
const switchDegree = document.getElementById("switch");
let temperatureDescr = document.querySelector(".temperature-description");
let temperatureDegree = document.querySelector(".temperature-degree");
let weatherTimezone = document.querySelector(".weather-timezone");
let humidity = document.querySelector(".humidity");
let wind = document.querySelector(".wind");
let current = "C";
let tempK;
let tempC;
let tempF;
let forecastTempC = [];
let forecastTempF = [];
let forecastTempK = [];
//for hourly based 
let forecastHourTempC = [];
let forecastHourTempF = [];
let forecastHourTempK = [];
let forecastHourDesc = [];
const weatherIcon = document.querySelector(".weather-icon");
const weatherShow = document.querySelector('.weather-show');
const forecastDays = document.querySelector(".forecast");
const feel = document.getElementById("feels-like");
const feelIcon = document.querySelector(".feels-like-icon");
let tempFeelsLike;
const weatherClass = document.querySelector("weather-app");
const body = document.body;
//forecast
const forecastItem = document.querySelectorAll(".forecast-item");
const forecastHourItems = document.querySelectorAll(".forecast-hour")
//const forecastDate = document.querySelector(".forecast-item-date");
//const forecastTemp = document.querySelector(".forecast-item-temp");
const plus = document.getElementById("plus");
const favorite = document.getElementById("favorite");
const tagsContainer = document.getElementById("tags-container");
let favorites = [];
let chart;


//start screen is just the input
const showWeather =()=>{
    weatherShow.style.display = "block";
    forecastDays.style.display="flex";
    document.querySelector(".forecast-hourly").style.display = "flex";
    document.querySelector(".forecast-title-hour").style.display = "block";
    document.querySelector(".forecast-title").style.display = "block";
    document.querySelector("#chart").style.display = "block";
};
//get current Date 

//User can use GPS location 
const getLocation = ()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(pos=>{
            long = pos.coords.longitude;
            lat = pos.coords.latitude;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`;
            fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log("Stadt:", data.name); 
            fetchWeather(long,lat);
            fetchForecastDays();
            fetchForecastHour();
            fetchForecastChart(data.name);
            //cityName =
            //updateWeather(data);
            console.log(temperatureDegree, temperatureDescr, weatherTimezone);
            
        });
        })
    }
}
// window.addEventListener("load",()=>{
//     // let long;
//     // let lat;
//     getLocation();
// });

//user can search his location 
gpsBttn.addEventListener("click", ()=>{
    showWeather();
    getLocation();
})

//user can switch between kelvin, celsius and farenheit
switchDegree.addEventListener("click",()=>{
    if(current === "C"){
        temperatureDegree.textContent = `${tempF.toFixed(1)}°F`;
        feel.textContent = `${tempF.toFixed(1)}°F`;
        current = "F";
    } else if(current === "F"){
        temperatureDegree.textContent = `${tempK.toFixed(1)}K`;
        feel.textContent = `${tempK.toFixed(1)}K`;
        current = "K";
    } else {
        temperatureDegree.textContent = `${tempC.toFixed(1)}°C`;
        feel.textContent = `${tempK.toFixed(1)}°C`;
        current = "C";
    }
    //change forecast 
    forecastItem.forEach((item,index)=>{
        if(current == "C"){
        item.querySelector(".forecast-item-temp").textContent = `${forecastTempC[index].toFixed(1)}°C`;
    } else if(current == "F"){
        item.querySelector(".forecast-item-temp").textContent = `${forecastTempF[index].toFixed(1)}°F`;
        
    }else{
        item.querySelector(".forecast-item-temp").textContent = `${forecastTempK[index].toFixed(1)}K`;
       
    }
    })
    forecastHourItems.forEach((item,index)=>{
        if(current == "C"){
        item.querySelector(".forecast-hour-temp").textContent = `${forecastHourTempC[index].toFixed(1)}°C`;
    } else if(current == "F"){
        item.querySelector(".forecast-hour-temp").textContent = `${forecastHourTempF[index].toFixed(1)}°F`;
        
    }else{
        item.querySelector(".forecast-hour-temp").textContent = `${forecastHourTempK[index].toFixed(1)}K`;
       
    }
    })

})
searchBttn.addEventListener("click",()=>{
    const cityName = document.getElementById("location").value;
    fetchCity(cityName);
    // fetchForecastDays();
    // fetchForecastHour();
    showWeather();
})

//geolocation api
const fetchWeather = async(long,lat)=>{
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`;
            fetch(url)
            .then(response=>{
            return response.json();
        }).then(data=>{
            console.log(data);
            updateWeather(data);
            console.log(temperatureDegree, temperatureDescr, weatherTimezone);

        })

}
//weather data
const updateWeather = async(data)=>{
    //const temp = data.main.temp;
    tempK = data.main.temp; //kelvin
    tempC = tempK - 273.15; //celcius
    tempF = (tempC * 9/5) + 32; //fahrenheit
    let tempFeel = data.main.feels_like;
    tempFeelsLike = tempFeel - 273.15; //celicius

    //temperatureDegree.textContent = `${tempK.toFixed(1)}K`
    temperatureDegree.textContent = `${tempC.toFixed(1)}°C`;
    temperatureDescr.textContent = data.weather[0].description;
    weatherTimezone.textContent = data.name;
    humidity.textContent = data.main.humidity + "%";
    wind.textContent = data.wind.speed + " km/h";
    feel.textContent = "feels like: " +`${tempFeelsLike.toFixed(1)}°C`;
    const now = data.dt;
    const sunrise = data.sys.sunrise;
    const sunset = data.sys.sunset;
    let night; 
    if(now< sunrise || now > sunset){
        night = true;
    }
    else{
        night=false;
    }
    setIcon(data,night);


}
//icon for temp and day/night
const setIcon = (data,night)=>{
const weatherPicture = data.weather[0].main;
if(night){
    body.style.background = "linear-gradient(to bottom, #3d3e45ff, #12171eff)";
    temperatureDegree.style.color = "#393c3eff";
    temperatureDescr.style.color = "#393c3eff";
    feel.style.color = "#393c3eff";
    weatherTimezone.style.color = "#393c3eff";

    if(weatherPicture == "Clear"){
            weatherIcon.src = "images/night.gif";
        } else if(weatherPicture == "Clouds"){
            weatherIcon.src = "images/cloudy-night.gif";
        } else if(weatherPicture == "Rain"){
            weatherIcon.src = "images/rain-night.gif";
        } else if(weatherPicture == "Snow"){
            weatherIcon.src = "images/snow-night.gif";
        } else if(weatherPicture == "Drizzle"){
            weatherIcon.src = "images/drizzle-night.gif";
        }else if(weatherPicture == "Thunderstorm"){
            weatherIcon.src = "images/storm-night.gif";
        }
}else{
    if(weatherPicture == "Clouds"){
        weatherIcon.src ="images/clouds.gif";
        body.style.background = "linear-gradient(to bottom, #A4D3EE, #8DB6CD)";
        temperatureDegree.style.color = "#8DB6CD";
        temperatureDescr.style.color = "#8DB6CD";
        feel.style.color = "#8DB6CD";
        weatherTimezone.style.color = "#8DB6CD";
    }
    else if (weatherPicture == "Clear") {
        weatherIcon.src = "images/sun.gif";
        body.style.background = "linear-gradient(to bottom, #FFA07A, #FF8C00)";
        temperatureDegree.style.color = "#FF8C00";
        temperatureDescr.style.color = "#FF8C00";
        feel.style.color = "#FF8C00";
        weatherTimezone.style.color = "#FF8C00";
    }else if (weatherPicture == "Rain") {
        weatherIcon.src = "images/rain.gif";
        body.style.background = "linear-gradient(to bottom, #d3d3d3, #808080)";
        temperatureDegree.style.color = "#808080";
        temperatureDescr.style.color = "#808080";
        feel.style.color = "#808080";
        weatherTimezone.style.color = "#808080";
    } else if (weatherPicture == "Snow") {
        weatherIcon.src = "images/snow.gif";
    } else if (weatherPicture == "Thunderstorm") {
        weatherIcon.src = "images/storm.gif";
        body.style.background = "linear-gradient(to bottom, #d3d3d3, #6E7B8B)";
        temperatureDegree.style.color = "#6E7B8B";
        temperatureDescr.style.color = "#6E7B8B";
        feel.style.color = "#6E7B8B";
        weatherTimezone.style.color = "#6E7B8B";
    } else if (weatherPicture == "Drizzle") {
        weatherIcon.src = "images/drizzle.gif";
        body.style.background = "linear-gradient(to bottom, #96CDCD, PowderBlue)";
        temperatureDegree.style.color = "PowderBlue";
        temperatureDescr.style.color = "PowderBlue";
        feel.style.color = "PowderBlue";
        weatherTimezone.style.color = "PowderBlue";
    }
}
}

//favorite button/menu
// plus.addEventListener("click",(e)=>{
// const city = document.getElementById("location").value;
// //does the city already exist
// const existingTag = favorites.find(fav => fav.name === city);
//     if (existingTag) {
//        return;
//     }else{
//         //add city
//         const tag = document.createElement("span");
//         tag.textContent=city;
//         tag.className="favorite-tag";
//         tag.addEventListener("click",()=> fetchCity(city));
//         tagsContainer.appendChild(tag);
//     }

//fetch city location 
const fetchCity = async(cityName)=>{
    showWeather();
    const url =`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&limit=1&appid=${apiKey}`;
    fetch(url)
    .then(response=>{
        return response.json();
    }).then(data=>{
        console.log(data);
        updateWeather(data);
        //fetchWeather(long,lat);
        lat = data.coord.lat;
        long = data.coord.lon;

        fetchForecastDays();
        fetchForecastHour();
        fetchForecastChart(cityName);
    })
};

//autofill for cities 
output.addEventListener("input", async()=>{
    const query = output.value;
    if(query.length <2){
        autofill.innerHTML = "";
        return;

    }
    const url = `https://api.weatherapi.com/v1/search.json?key=${apiKeyWeather}&q=${query}`;
        const res = await fetch(url);
        const data = await res.json();
        autofill.innerHTML="";
        data.forEach(city=>{
            const li = document.createElement("li");
            li.textContent=`${city.name}, ${city.country}`;
            li.addEventListener("click", ()=>{
                output.value = `${city.name}, ${city.country}`;
                autofill.innerHTML = ""; //list disappears
                //fetchCity(city.name);

            });
            autofill.appendChild(li);
        })

})


//get forecast for 5 days
const fetchForecastDays = async()=>{
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${apiKey}`;
    fetch(url)
    .then(response=>{
        return response.json();
    }).then(data=>{
        const forecastData = data.list;
        const dailyForecasts = forecastData.filter(e => e.dt_txt.includes("12:00:00"));
        dailyForecasts.forEach((e, index) => {
        if(index < 5){
            const date = new Date(e.dt_txt.replace(" ", "T")); //becuase api has " " between hour and date 
            console.log(date);
            const day = date.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' });
            const tempC = e.main.temp - 273.15; // Kelvin -> Celsius
            const tempF = (tempC * 9/5) + 32;
            const tempK = e.main.temp;

            forecastTempC[index]=tempC;
            forecastTempK[index]=tempK;
            forecastTempF[index]=tempF;
            const description = e.weather[0].main;
            //forecastItem[index];
            forecastItem[index].querySelector(".forecast-item-date").textContent = day;
            forecastItem[index].querySelector(".forecast-item-temp").textContent = `${tempC.toFixed(1)}°C`;
            forecastItem[index].querySelector(".forecast-description").textContent = description;
            const icon = forecastItem[index].querySelector(".forecast-item-img");
            if(description == "Clouds"){
                icon.src = "images/clouds.gif";
            }
            else if(description == "Clear"){
                icon.src = "images/sun.gif";
            } 
            else if(description == "Rain"){
                icon.src = "images/rain.gif";
            } 
            else if(description == "Snow"){
                icon.src = "images/snow.gif";
            }
            else if(description == "Thunderstorm"){
                icon.src = "images/storm.gif";
            } 
            else if(description == "Drizzle"){
                icon.src = "images/drizzle.gif";
            } 
        }

        });
    })

}

//forcast for the next 3hours 
const fetchForecastHour = async()=>{
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${apiKey}`;
    fetch(url)
    .then(response=>{
        return response.json();
    }).then(data=>{
        const forecastData = data.list;
        forecastData.forEach((e,index)=>{
            if(index < 8){
                const date = new Date(e.dt_txt.replace(" ", "T"));
                //hour and minutes 
                const time = date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

                const tempC = e.main.temp - 273.15; // Kelvin -> Celsius
                const tempF = (tempC * 9/5) + 32;
                const tempK = e.main.temp;

                forecastHourTempC[index]=tempC;
                forecastHourTempK[index]=tempK;
                forecastHourTempF[index]=tempF;
                const description = e.weather[0].main;
        
                forecastHourItems[index].querySelector(".forecast-hour-temp").textContent = `${tempC.toFixed(1)}°C`;
                forecastHourItems[index].querySelector(".forecast-hour-time").textContent = time;

                const icon = forecastHourItems[index].querySelector(".forecast-hour-img");
                icon.alt = description;
                if(description == "Clouds"){
                    icon.src = "images/clouds.gif";
                }
                else if(description == "Clear"){
                    icon.src = "images/sun.gif";
                } 
                else if(description == "Rain"){
                    icon.src = "images/rain.gif";
                } 
                else if(description == "Snow"){
                    icon.src = "images/snow.gif";
                }
                else if(description == "Thunderstorm"){
                    icon.src = "images/storm.gif";
                } 
                else if(description == "Drizzle"){
                    icon.src = "images/drizzle.gif";
                } 
            }
        });
    });


}
//chart from two different api 
const fetchForecastChart = async(cityName)=>{
//     const chartEl = document.querySelector("#chart");
//   chartEl.style.display = "block"; // Sichtbar machen
//   console.log("Chart-Container gefunden:", chartEl);

    //first api
    const url1 =`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${apiKey}`;
    const data1 = await fetch(url1).then(res => res.json());
    const forecast1 = data1.list.slice(0, 8).map(e => e.main.temp - 273.15);

    const url2 = `https://api.weatherapi.com/v1/forecast.json?key=${apiKeyWeather}&q=${cityName}&days=1`;
    const data2= await fetch(url2).then(response=>response.json());
    const forecast2 = data2.forecast.forecastday[0].hour
        .filter((_, i) => i % 3 === 0)
        .map(e => e.temp_c);
    const hours = forecast1.map((_, i) => `${i*3}:00`);

    const len = Math.min(forecast1.length, forecast2.length);
    const labels = Array.from({length: len}, (_, i) => `${i*3}:00`);
    const values1 = forecast1.slice(0, len);
    const values2 = forecast2.slice(0, len);
    console.log(document.querySelector("#chart"));


    //chart for api 
    const chartData={
        labels: labels,
        datasets: [
            {name:"First Data", values: values1, color:"#b0e0e6"},
            { name: "Second Data", values: values2, color: "#0000ff" }
        ]
    };
    if(chart){
        chart.update(chartData);
    }else{
        chart = new frappe.Chart("#chart",{
            title: "24h Forecast",
            data:chartData,
            type:"line",
            height:400,
            axisOptions: {
                xAxisMode: "tick",
                yAxisMode: "span",
                xIsSeries: true
            },
            lineOptions: {
                regionFill: 1
            }
        });
    }
}