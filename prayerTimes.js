async function getPrayerTimes() {
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0];
    try {
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity/${formattedDate}?city=Cairo&country=Egypt&method=2`);
        const data = await response.json();
        return data.data.timings;
    } catch (error) {
        console.error('Error fetching prayer times:', error);
        return null;
    }
}

function getNextPrayer(timings) {
    if (!timings) return null;

    const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    for (const prayer of prayers) {
        const [hours, minutes] = timings[prayer].split(':').map(Number);
        const prayerTime = hours * 60 + minutes;

        if (prayerTime > currentTime) {
            const diff = prayerTime - currentTime;
            const hoursLeft = Math.floor(diff / 60);
            const minutesLeft = diff % 60;
            return {
                name: prayer,
                timeLeft: `${hoursLeft}h ${minutesLeft}m`
            };
        }
    }

    // If no prayer is left today, return time until tomorrow's Fajr
    const [fajrHours, fajrMinutes] = timings['Fajr'].split(':').map(Number);
    const fajrTime = fajrHours * 60 + fajrMinutes;
    const timeUntilFajr = (24 * 60 - currentTime) + fajrTime;
    const hoursLeft = Math.floor(timeUntilFajr / 60);
    const minutesLeft = timeUntilFajr % 60;

    return {
        name: 'Fajr',
        timeLeft: `${hoursLeft}h ${minutesLeft}m`
    };
}

function updatePrayerTime() {
    getPrayerTimes().then(timings => {
        const nextPrayer = getNextPrayer(timings);
        if (nextPrayer) {
            document.getElementById('prayer-time').textContent =
                `${nextPrayer.name} in ${nextPrayer.timeLeft}`;
        }
    });
}
