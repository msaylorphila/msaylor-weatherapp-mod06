// var requestURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=39.9526&lon=-75.1652&appid=4973a6326f483e7b798272289cc9113f'
// for philly
var apiKey = '4973a6326f483e7b798272289cc9113f'
var citySearch = document.getElementById('citySearch')
var weatherButton = document.getElementById('weatherButton')
// var geoCode = 'http://api.openweathermap.org/geo/1.0/direct?q=' + citySearch.value + '&appid=' + apiKey
var search = document.getElementById('search')
var currentDay = document.getElementById('currentDay')
var days = document.querySelectorAll("[id^='day']")
var daysContainer = document.getElementById('days-container')
// fetch(geoCode)
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     console.log(data);
//   });



function weatherApp(event) {
    event.preventDefault();
    var geoCode = 'http://api.openweathermap.org/geo/1.0/direct?q=' + citySearch.value + '&appid=' + apiKey

    fetch(geoCode)
    .then(function (response) {
    return response.json();
    })
    .then(function (data) {
    var lat = data[0].lat;
    var lon = data[0].lon;
    var requestURL = 'https://api.openweathermap.org/data/2.5/forecast?lat='+ lat +'&lon=' + lon + '&appid=4973a6326f483e7b798272289cc9113f&units=imperial'
    var todayWeather = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon +'&appid=4973a6326f483e7b798272289cc9113f&units=imperial'
    dayOne(requestURL)
    return todayWeather
    }).then(
        function (url) {
            fetch(url).then(
                function (data) {return data.json()
                }).then(
                    function (currentWeather) {
                        var cityName = currentWeather.name
                        var temp = currentWeather.main.temp 
                        // var kToF = Math.floor(((temp-273.15)*1.8)+32)
                        var wind = currentWeather.wind.speed
                        var humidity = currentWeather.main.humidity
                        var todayDate = dayjs().format('M-DD-YYYY')
                        currentDay.textContent = cityName + "(" + todayDate + ")" + " Temp: " + temp + " Wind: " + wind + " Humidity: " + humidity
                    console.log(currentWeather)
                    })
                }
    )
}



var dayOne = function (requestURL){
    fetch(requestURL)
    .then(function (response) {
    return response.json();
    })
    .then(function (data) {
    return data })
    .then(
        function(data) {
            console.log(data)
            for (var i = 7; i < 40; i+=8) {
                var cityName = data.city.name
                var temp = data.list[i].main.temp 
                var wind = data.list[i].wind.speed
                var humidity = data.list[i].main.humidity
                var todayDate = data.list[i].dt_txt
                var dateShort = todayDate.split(' ')
                var DS = dateShort[0]
                var fiveDay = cityName + "(" + DS + ")" + " Temp: " + temp + " Wind: " + wind + " Humidity: " + humidity
                var dayEl = document.createElement('div')
                dayEl.textContent = fiveDay
                daysContainer.appendChild(dayEl)
                console.log(fiveDay)
                // dayLoop(fiveDay)
                
                
                  
    
    
        }
})
}

// var dayLoop = function(fiveDay){
//     for (var i = 0; i < days.length; i++ ) {
//         days[i].textContent = fiveDay}  
//         console.log(fiveDay) 
// }

// fetch(requestUrl)
// .then(function (response) {
//   return response.json();
// })
// .then(function (data) {

//   console.log(data)

// });
// }

search.addEventListener('submit', weatherApp)