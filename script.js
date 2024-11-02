`use strict`;

// display time as hh:mm
const options = {
    timeZone : Intl.DateTimeFormat().resolvedOptions().timeZone, // Automatically get user's timezone
    hour12 : true,
    hour:  "2-digit",
    minute: "2-digit",
}

const locale = navigator.languages != undefined ? navigator.languages[0] : navigator.language; // Get user's locale to format clock accordingly

myTimer(); // Initialise clock otherwise you wait a second before it appears
myDate(); // Initialise date

var myVar = setInterval(function () {
    myTimer();
}, 1000);

function myTimer() {
    var today = new Date();
    var time = today.toLocaleTimeString(locale, options);
    document.getElementById("time").textContent = time;

    // Update prayer time every minute
    if (today.getSeconds() === 0) {
        updatePrayerTime();
    }
}

function myDate() {
    var today = new Date();
    var dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var date = today.toLocaleDateString(locale, dateOptions);
    document.getElementById("date").textContent = date;
}

document.addEventListener("DOMContentLoaded", function() {
    myDate(); // Update date on page load
    updatePrayerTime(); // Initial prayer time update
});
