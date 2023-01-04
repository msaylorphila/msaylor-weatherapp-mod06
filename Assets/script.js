// var requestURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=39.9526&lon=-75.1652&appid=4973a6326f483e7b798272289cc9113f'
// for philly
var apiKey = '4973a6326f483e7b798272289cc9113f'
var citySearch = document.getElementById('citySearch')
var weatherButton = document.getElementById('weatherButton')
// var geoCode = 'http://api.openweathermap.org/geo/1.0/direct?q=' + citySearch.value + '&appid=' + apiKey
var search = document.getElementById('search')
var currentDay = document.getElementById('currentDay')
// fetch(geoCode)
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     console.log(data);
//   });


function weatherApp(event) {
    event.preventDefault();
    console.log(citySearch.value)
    var geoCode = 'http://api.openweathermap.org/geo/1.0/direct?q=' + citySearch.value + '&appid=' + apiKey

    fetch(geoCode)
    .then(function (response) {
    return response.json();
    })
    .then(function (data) {
    var lat = data[0].lat;
    var lon = data[0].lon;
    var requestURL = 'https://api.openweathermap.org/data/2.5/forecast?lat='+ lat +'&lon=' + lon + '&appid=4973a6326f483e7b798272289cc9113f'
    console.log(requestURL)
    return requestURL
    }).then(
        function (url) {
            fetch(url).then(
                function (data) {return data.json()
                }).then(
                    function (currentWeather) {
                        
                        var temp = currentWeather.list[0].main.temp
                        var wind = currentWeather.list[0].wind.deg
                        var humidity = currentWeather.list[0].main.humidity
                        console.log(temp, humidity, wind)

                        currentDay.textContent = "Temp: " + temp + " Wind: " + wind + " Humidity " + humidity
                    })
        }
    )
}


// fetch(requestUrl)
// .then(function (response) {
//   return response.json();
// })
// .then(function (data) {

//   console.log(data)

// });
// }

search.addEventListener('submit', weatherApp)

