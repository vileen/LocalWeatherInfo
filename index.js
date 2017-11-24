var currentPosition, timeOfDay;
var getLocation = function() {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: 'http://ipinfo.io/json',
            success: function(ret) {
                resolve(ret);
            },
            error: function(ret) {
                resolve(ret);
            }
        })
    })
}


var showPosition = function(position) {
    currentPosition = position;
    $('#position').text(position.city + ", " + position.country);
}

var getWeather = function(callback) {
    var api = 'http://api.openweathermap.org/data/2.5/weather?q=';
    var position = currentPosition.city+","+currentPosition.country.toLowerCase();
    var apikey = '&appid=b7bf2069c56587884297db2c16872ae3';
    var units = "&units=metric";
    $.ajax({
        url: api+position+units+apikey,
        success: function(ret) {
            callback(ret);
        }
    })
}

var addWeatherIcon = function() {
    var classList = document.getElementById('icon').className;
    console.log(classList);
    var icon = '';
    switch(classList.toLowerCase()) {
        case "thunderstorm":
            if(timeOfDay === "day") {
                icon = 'wi-day-thunderstorm';
            } else {
                icon = 'wi-night-thunderstorm';
            }
            break;
        case "rain":
            if(timeOfDay === "day") {
                icon = 'wi-day-rain';
            } else {
                icon = 'wi-night-rain';
            }
            break;
        case "clouds":
            if(timeOfDay === "day") {
                icon = 'wi-day-cloudy';
            } else {
                icon = 'wi-night-alt-cloudy';
            }
            break;
        case "clear":
            if(timeOfDay === "day") {
                icon = 'wi-day-sunny';
            } else {
                icon = 'wi-night-clear';
            }
            break;
    }

    $('#icon').html('<i style="font-size: 3em; margin-top: 40px;"class="wi '+icon+'"></i>');
}

var showWeather = function(weather) {
    $('#temperature').prepend("<span id='tempValue'>"+Math.floor(weather.main.temp)+"</span>"+"");
    $('#info').text(weather.weather[0].main)
    $('#icon').addClass(weather.weather[0].main);
    timeOfDay = weather.sys.sunset > moment().unix() && weather.sys.sunrise < moment().unix() ? "day" : "night";
    addWeatherIcon();
}

$(document).ready(function() {
    $('#switchMetrics').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var currentMetrics = $(this).text();
        switch(currentMetrics) {
            case "C":
                $(this).text('F');
                $('#preMetric').text("");
                $('#tempValue').text($('#tempValue').text()  * 9/5 + 32);
                break;
            case "F":
                $(this).text('C');
                $('#preMetric').html('&deg;');
                $('#tempValue').text(($('#tempValue').text() - 32)  * 5/9);
        }
    })

    getLocation().then(function(position) {
        showPosition(position);
        getWeather(showWeather);
    })
})