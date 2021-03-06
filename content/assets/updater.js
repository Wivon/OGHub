const { ipcRenderer, shell } = require('electron');
// update notification
const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');

let UPDATER_STATUS = "UTD";

ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available');
    message.innerText = '🔃Update available ! downloading...';
    notification.classList.remove('hidden');

    // update in settings
    UPDATER_STATUS = 'UPDATE_AV'
    try {
        setUpdaterStatus()
    } catch (error) {
        console.error(error);
    }
});

ipcRenderer.on('update_downloaded', () => {
    sendTempNotification('🔃Restart to install new update', 10000)
    document.querySelector('#notification #restart-button').classList.remove('hidden')

    // update in settings
    UPDATER_STATUS = 'UPDATE_DL'
    setUpdaterStatus()
});

function closeNotification() {
    notification.classList.add('hidden');
}

function restartApp() {
    ipcRenderer.send('restart_app');
}

sendCheckForUpdate()

function sendCheckForUpdate() {
    ipcRenderer.send('checkForUpdates');
}

function setUpdaterStatus() {
    if (UPDATER_STATUS == 'UPDATE_AV') {
        document.querySelector('.parameterContent div div h2').innerHTML = "Downloading new update..."
        document.querySelector('.parameterContent div div h4').innerHTML = "you can continue to use OG Hub while downloading"
        document.querySelector('.parameterContent div div .buttons .checkBtn').classList.add('hidden');

        setDownloadProgress();

    } else if (UPDATER_STATUS == 'UPDATE_DL') {
        document.querySelector('.parameterContent div div h2').innerHTML = "🔃 New Update Downloaded."
        document.querySelector('.parameterContent div div h4').innerHTML = "-> update will be installed on restart"
        document.querySelector('.parameterContent div div .buttons .restartBtn').classList.remove('hidden');
        document.querySelector('.parameterContent div div .buttons .checkBtn').classList.add('hidden');

        // change check for update button style
        document.querySelector('.parameterContent div div .checkBtn').style.opacity = 0.5;
        document.querySelector('.parameterContent div div .checkBtn').style.pointerEvents = 'none';
        document.querySelector('.parameterContent div div .checkBtn').innerHTML = "upadte ready to install";

        // hide download progress indicator
        document.querySelector('.downloadProgress').classList.remove('downloading');
        clearInterval(dlIndicatorRefreshInterval);
        dlIndicatorRefreshInterval = null;
    } else if (UPDATER_STATUS == 'UTD') {
        document.querySelector('.parameterContent div div h2').innerHTML = '✅ You\'re up to date !'
        document.querySelector('.parameterContent div div .buttons .restartBtn').classList.add('hidden');
        document.querySelector('.parameterContent div div .buttons .checkBtn').classList.remove('hidden');

        // change check for update button style
        document.querySelector('.parameterContent div div .checkBtn').style.opacity = 1;
        document.querySelector('.parameterContent div div .checkBtn').style.pointerEvents = 'auto';
        document.querySelector('.parameterContent div div .checkBtn').innerHTML = "Check for Updates";

    }
}

let dlIndicatorRefreshInterval

function setDownloadProgress() {
    document.querySelector('.downloadProgress').classList.add('downloading');
    dlIndicatorRefreshInterval = setInterval(DownloadProgressIntervalFunctions, 500)
}

function DownloadProgressIntervalFunctions() {
    if (dlProgressObj[1] == "100") {
        // if dl finished clear
        setUpdaterStatus()
        return
    } else {
        document.querySelector('.dlPercent').textContent = dlProgressObj[1].slice(0, 4) + '%';
        document.querySelector('.dlProg').value = Math.floor(dlProgressObj[2] / 1000000);
        document.querySelector('.dlProg').setAttribute('max', Math.floor(dlProgressObj[3] / 1000000));
        document.querySelector('.dlSpeed').textContent = Math.floor(dlProgressObj[0] / 1000000) + "Mb/s";
        return
    }
}

function CLEAR_timer_INTERVAL() {
    console.log('download finished ! cleared interval, changing status to "UPDATE_DL"')
}

let dlProgressObj = []

ipcRenderer.on('download-progress', (event, progress) => {
    dlProgressObj = JSON.parse(progress)
})