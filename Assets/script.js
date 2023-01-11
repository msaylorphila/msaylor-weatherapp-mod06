var apiKey = '4973a6326f483e7b798272289cc9113f';
var cityInput = document.getElementById('cityInput');
var searchFormEl = document.getElementById('searchFormEl');
var searchButtonEl = document.getElementById('searchButtonEl')
var daysContainer = document.getElementById('days-container');
var asideContainer = document.getElementById('buttonSearchContainer');
var currentContainer = document.getElementById('currentContainer');
var forecastTitle = document.getElementById('fiveday');
var countryCode = document.getElementById('countryCode');
var resetButtonEl = document.getElementById('resetButtonEl');

function resetWeather (event) {
    event.preventDefault();
    localStorage.clear("cityObjArr");
    location.reload();
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


function getCoordinates(event, cityNameInput, countryCode) {
    forecastTitle.classList.add('hide')
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
            currentWeather(cityNameInput, coordinates)
            var cityObjArr = JSON.parse(localStorage.getItem("cityObjArr"));
            if (cityObjArr == null) {
                cityObjArr = [];
            } 

            if (cityObjArr.filter(e => (e.cityName.toLowerCase() == cityNameInput.toLowerCase())).length == 0) {
                cityObjArr.push(geoData)
                localStorage.setItem("cityObjArr", JSON.stringify(cityObjArr))
            }   
     

})}



    
            
function currentWeather(cityNameInput, coordinates) {
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
        

var errorCheck = function (data) {
    var empty = JSON.stringify(data);
    if (empty === "[]") {
        alert("Please enter a valid city name");
        return true
    }
    return false
}

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
    } else {
        var cityButton = document.getElementById(`new-city-${cityName}`);
        if (cityButton === null) {
            var newButton = document.createElement("button");
            newButton.textContent = cityName;
            newButton.classList.add('buttonStyle');
            asideContainer.appendChild(newButton);
            newButton.id = (`new-city-${cityName}`);
            // newButton.onclick = function (event) { getWeather(event, cityName) };
            newButtonClick(newButton, cityName);
        }
    }
}


var newButtonClick = function (newButton, cityName) {
    newButton.onclick = function (event) { getCoordinates(event, cityName) }
}
makeCityButton() 
resetButtonEl.onclick = ('click,', function(event) {resetWeather(event)})
searchButtonEl.addEventListener('click', function (event) { getCoordinates(event, cityInput.value, countryCode.value)});
