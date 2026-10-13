async function getWeather() {

    const city = document.getElementById("city").value.trim();
    const result = document.getElementById("result");

    if(city===""){
        result.innerHTML="<p class='error'>Please enter a city name.</p>";
        return;
    }

    try{

        // Get city coordinates
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
        );

        const geoData = await geoResponse.json();

        if(!geoData.results){
            throw new Error("City not found");
        }

        const place = geoData.results[0];

        const latitude = place.latitude;
        const longitude = place.longitude;

        // Get weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code`
        );

        const weatherData = await weatherResponse.json();

        const temp = weatherData.current.temperature_2m;
        const humidity = weatherData.current.relative_humidity_2m;
        const code = weatherData.current.weather_code;

        let condition = "Unknown";

        if(code==0)
            condition="Clear Sky";
        else if(code<=3)
            condition="Cloudy";
        else if(code<=55)
            condition="Fog / Drizzle";
        else if(code<=65)
            condition="Rain";
        else if(code<=77)
            condition="Snow";
        else if(code<=99)
            condition="Thunderstorm";

        result.innerHTML=`
            <h2>${place.name}</h2>
            <p><strong>Temperature:</strong> ${temp} °C</p>
            <p><strong>Humidity:</strong> ${humidity}%</p>
            <p><strong>Weather:</strong> ${condition}</p>
        `;

    }
    catch(error){

        result.innerHTML=`
        <p class="error">
            ${error.message}
        </p>
        `;
    }
}