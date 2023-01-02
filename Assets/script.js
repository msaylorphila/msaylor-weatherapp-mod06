var requestURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=39.9526&lon=-75.1652&appid=4973a6326f483e7b798272289cc9113f'

fetch(requestURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  });

