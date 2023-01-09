var apiKey = '4973a6326f483e7b798272289cc9113f';
var searchInput = document.getElementById('searchInput');
// var weatherButton = document.getElementById('weatherButton');
var searchFormEl = document.getElementById('searchFormEl');
// var currentDay = document.getElementById('currentDay');
// var days = document.querySelectorAll("[id^='day']");
var daysContainer = document.getElementById('days-container');
var asideContainer = document.getElementById('buttonSearchContainer');
var currentContainer = document.getElementById('currentContainer');
var forecastTitle = document.getElementById('fiveday')



function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


function getWeather(event, cityNameInput) {
    forecastTitle.classList.add('hide')
    removeAllChildNodes(currentContainer);
    removeAllChildNodes(daysContainer);

    event.preventDefault();
    var geoCode = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityNameInput + '&appid=' + apiKey;

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
            var requestURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=4973a6326f483e7b798272289cc9113f&units=imperial';
            var todayWeather = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=4973a6326f483e7b798272289cc9113f&units=imperial';
            dayLoop(requestURL);

            return todayWeather
        }).then(
            function (url) {
                fetch(url).then(
                    function (data) {
                        return data.json()
                    }).then(
                        function (currentWeather) {
                            var cityName = currentWeather.name;
                            var temp = "Temp: " + currentWeather.main.temp + "\u00B0F";
                            var wind = "Wind: " + currentWeather.wind.speed + "MPH";
                            var humidity = "Humidity: " + currentWeather.main.humidity + "%";
                            var todayDate = dayjs().format('M-DD-YYYY');
                            // var currentDayEl = "Temp: " + temp + "\u00B0F \n" + "Wind: " + wind + "MPH" + " Humidity: " + humidity + "%";
                            var headerEl = document.createElement("h2");
                            var dateEl = document.createElement("h3");
                            var tempEl = document.createElement("p")
                            var windEl = document.createElement("p")
                            var humidityEl = document.createElement("p")
                            headerEl.textContent = cityName;
                            dateEl.textContent = todayDate;
                            tempEl.textContent = temp;
                            windEl.textContent = wind;
                            humidityEl.textContent = humidity;
                            // currentDay.classList.add('card')
                            var icon = currentWeather.weather[0].icon;
                            var img0 = document.createElement("img");
                            img0.src = 'https://openweathermap.org/img/w/' + icon + '.png';
                            currentContainer.append(headerEl, dateEl, tempEl, windEl, humidityEl);
                            dateEl.appendChild(img0);


                        })
            }
        )
}

var errorCheck = function (data) {
    var empty = JSON.stringify(data);
    if (empty === "[]") {
        alert("Please enter a valid city name");
        return true
    }
    return false
}

var dayLoop = function (requestURL) {
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
                    var cityName = data.city.name;
                    var temp = "Temp: " + data.list[i].main.temp + "\u00B0F";
                    var wind = "Wind: " + data.list[i].wind.speed + "MPH";
                    var humidity = "Humidity: " + data.list[i].main.humidity + "%";
                    var todayDate = data.list[i].dt_txt;
                    var dateShort = todayDate.split(' ');
                    var DS = dateShort[0].slice("6");
                    var icon = data.list[i].weather[0].icon.replace("n", "d");
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

makeCityButton = function (cityName) {
    var cityButton = document.getElementById(`new-city-${cityName}`);
    if (cityButton === null) {
        var newButton = document.createElement("button");
        newButton.textContent = cityName;
        newButton.classList.add('w-50', 'buttonColor');
        asideContainer.appendChild(newButton);
        newButton.id = (`new-city-${cityName}`);
        newButton.onclick = function (event) { getWeather(event, cityName) };
        newButtonClick(newButton, cityName);
    }
}



var newButtonClick = function (newButton, cityName) {
    newButton.onclick = function (event) { getWeather(event, cityName) }
}

searchFormEl.addEventListener('submit', function (event) { getWeather(event, searchInput.value) });