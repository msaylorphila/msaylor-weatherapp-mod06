var apiKey = '4973a6326f483e7b798272289cc9113f';
var cityInput = document.getElementById('cityInput');
var searchFormEl = document.getElementById('searchFormEl');
var searchButtonEl = document.getElementById('searchButtonEl');
var daysContainer = document.getElementById('days-container');
var asideContainer = document.getElementById('buttonSearchContainer');
var currentContainer = document.getElementById('currentContainer');
var forecastTitle = document.getElementById('fiveday');
var countryCode = document.getElementById('countryCode');
var resetButtonEl = document.getElementById('resetButtonEl');

// function to clear local storage and reload the page
function resetWeather (event) {
    event.preventDefault();
    localStorage.clear("cityObjArr");
    location.reload();
}

// removes children from their parent elements 

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// this function takes our citynameinput and country code on click and fetches them into the geocoding url
// it then is fetched and pulls the latitude, longitude, and city name and stores them into an object weve named geodata
function getCoordinates(event, cityNameInput, countryCode) {
    forecastTitle.classList.add('hide');
    removeAllChildNodes(currentContainer);
    removeAllChildNodes(daysContainer);

    event.preventDefault();
    var geoCode = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityNameInput + ',' + countryCode +'&appid=' + apiKey;
    fetch(geoCode)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (errorCheck(data)) {
                throw Error("Invalid city name entered.")
            }
            var lat = data[0].lat;
            var lon = data[0].lon;
            var name = data[0].name
            var coordinates = [lat, lon]
            var geoData = {
                cityName: name,
                coordinates: coordinates,
            };
            dayLoop(coordinates);
            currentWeather(coordinates);
            // we check to see if our city obj array is in local storage and if not we add set it to an empty array
            var cityObjArr = JSON.parse(localStorage.getItem("cityObjArr"));
            if (cityObjArr == null) {
                cityObjArr = [];
            } 
            // this iterates through each item in our array, changes each cityname in our array to lower case and compares it to our input which weve also changed to lowercase.
            // if there are 0 matches we push our geodata object and set our cityobjarr in localstorage.
            if (cityObjArr.filter(e => (e.cityName.toLowerCase() == cityNameInput.toLowerCase())).length == 0) {
                cityObjArr.push(geoData);
                localStorage.setItem("cityObjArr", JSON.stringify(cityObjArr));
            }   
     

})}



    
 // here we fetch the coordinates weve just gathered above and apply them to the current weather api link. we then create variables and append each element to a container in the html.
function currentWeather(coordinates) {
       var todayWeather = 'https://api.openweathermap.org/data/2.5/weather?lat=' + coordinates[0] + '&lon=' + coordinates[1] + '&appid=4973a6326f483e7b798272289cc9113f&units=imperial';
       fetch(todayWeather).then(
                    function (data) {
                        return data.json()
                    }).then(
                        function (currentWeather) {
                            var cityName = currentWeather.name;
                            var temp = "Temp: " + currentWeather.main.temp + "\u00B0F";
                            var wind = "Wind: " + currentWeather.wind.speed + "MPH";
                            var humidity = "Humidity: " + currentWeather.main.humidity + "%";
                            var todayDate = dayjs().format('M-DD-YYYY');
                            var headerEl = document.createElement("h2");
                            var dateEl = document.createElement("p");
                            var tempEl = document.createElement("p")
                            var windEl = document.createElement("p")
                            var humidityEl = document.createElement("p")
                            headerEl.textContent = cityName;
                            dateEl.textContent = todayDate;
                            tempEl.textContent = temp;
                            windEl.textContent = wind;
                            humidityEl.textContent = humidity;
                            var icon = currentWeather.weather[0].icon;
                            var img0 = document.createElement("img");
                            img0.src = 'https://openweathermap.org/img/w/' + icon + '.png';
                            currentContainer.append(headerEl, dateEl, tempEl, windEl, humidityEl);
                            dateEl.appendChild(img0);


                        })
            }
        
// this function checks above in the geocode api to see whether the api returns. If response errors, we alert the user to enter a valid city name
var errorCheck = function (data) {
    var empty = JSON.stringify(data);
    if (empty === "[]") {
        alert("Please enter a valid city name");
        return true
    }
    return false
}
// This loops through the forecast gathering data for each day for the specific city. 
// if it errors we catch and console it
var dayLoop = function (coordinates) {
    var requestURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + coordinates[0] + '&lon=' + coordinates[1] + '&appid=4973a6326f483e7b798272289cc9113f&units=imperial';

    fetch(requestURL)
        .then(function (response) {
            if (!response.ok) {
                document.write("<p>Response was not OK.</p>")
            }
            return response.json();
        })
        .then(function (data) {
            return data
        })
        .then(
            function (data) {
                var cityName = data.city.name;
                makeCityButton(cityName);
                forecastTitle.classList.remove('hide')
                for (var i = 7; i < 40; i += 8) {
                    var eachDay = data.list[i]
                    var cityName = data.city.name;
                    var temp = "Temp: " + eachDay.main.temp + "\u00B0F";
                    var wind = "Wind: " + eachDay.wind.speed + "MPH";
                    var humidity = "Humidity: " + eachDay.main.humidity + "%";
                    var todayDate = eachDay.dt_txt;
                    var dateShort = todayDate.split(' ');
                    var DS = dateShort[0].slice("6");
                    var icon = eachDay.weather[0].icon.replace("n", "d");
                    var cardBody = document.createElement('div')
                    var headerEl = document.createElement('span')
                    var tempEl = document.createElement('p');
                    var windEl = document.createElement('p');
                    var humidityEl = document.createElement('p');
                    headerEl.textContent = DS + "-2023";
                    var img0 = document.createElement("img");
                    img0.src = 'https://openweathermap.org/img/w/' + icon + '.png';
                    cardBody.classList.add('dayColor', 'card-body', "col-lg-3", "col-sm-12");
                    headerEl.classList.add('dayColor'),
                    tempEl.classList.add('dayColor'),
                    windEl.classList.add('dayColor'),
                    humidityEl.classList.add('dayColor'),
                    img0.classList.add('dayColor');
                    tempEl.textContent = temp;
                    windEl.textContent = wind;
                    humidityEl.textContent = humidity
                    daysContainer.appendChild(cardBody);
                    cardBody.append(headerEl, tempEl, windEl, humidityEl);
                    headerEl.appendChild(img0);
                  


                }
            }).catch((err) => console.error(err))
}
// this makes buttons for each city entered into our local storage.
makeCityButton = function (cityName = null) {
    if (cityName === null) {
        var cityObjArr = JSON.parse(localStorage.getItem("cityObjArr"));
        if (cityObjArr != null && cityObjArr.length != 0) {
            cityObjArr.forEach(cityObj => {
                var savedCityName = cityObj.cityName
                var cityButton = document.getElementById(`new-city-${savedCityName}`);
                if (cityButton === null) {
                    var newButton = document.createElement("button");
                    newButton.textContent = savedCityName;
                    newButton.classList.add('buttonStyle');
                    asideContainer.appendChild(newButton);
                    newButton.id = (`new-city-${savedCityName}`);
                    newButtonClick(newButton, savedCityName);
                }
            })
        }
    } else { //if the city doesnt we create it.
        var cityButton = document.getElementById(`new-city-${cityName}`);
        if (cityButton === null) {
            var newButton = document.createElement("button");
            newButton.textContent = cityName;
            newButton.classList.add('buttonStyle');
            asideContainer.appendChild(newButton);
            newButton.id = (`new-city-${cityName}`);
            newButtonClick(newButton, cityName);
        }
    }
}

// click functions for all our buttons.
var newButtonClick = function (newButton, cityName) {
    newButton.onclick = function (event) { getCoordinates(event, cityName) }
}
makeCityButton() 
resetButtonEl.onclick = ('click,', function(event) {resetWeather(event)})
searchButtonEl.addEventListener('click', function (event) { getCoordinates(event, cityInput.value, countryCode.value)});
