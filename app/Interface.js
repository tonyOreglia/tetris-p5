function initInterface() {
    document.getElementById('myButton').addEventListener('click', (e) => {
        appSettings.paused = !appSettings.paused;
    });
}
