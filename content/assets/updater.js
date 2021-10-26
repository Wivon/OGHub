const { ipcRenderer, shell } = require('electron');
// update notification
const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');

let UPDATER_STATUS = "UTD";

ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available');
    message.innerText = 'ℹ️ Update available ! downloading...';
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
    ipcRenderer.removeAllListeners('update_downloaded');
    message.innerText = 'ℹ️ New Update Downloaded. install on restart';
    restartButton.classList.remove('hidden');
    notification.classList.remove('hidden');

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
        document.querySelector('.parameterContent div div h2').innerHTML = "ℹ️ Update available ! downloading..."
        document.querySelector('.parameterContent div div .buttons .checkBtn').classList.add('hidden');

        setDownloadProgress();

    } else if (UPDATER_STATUS == 'UPDATE_DL') {
        document.querySelector('.parameterContent div div h2').innerHTML = "ℹ️ New Update Downloaded. install on restart."
        document.querySelector('.parameterContent div div .buttons .restartBtn').classList.remove('hidden');
        document.querySelector('.parameterContent div div .buttons .checkBtn').classList.add('hidden');
        
        // change check for update button style
        document.querySelector('.parameterContent div div .checkBtn').style.opacity = 0.5;
        document.querySelector('.parameterContent div div .checkBtn').style.pointerEvents = 'none';
        document.querySelector('.parameterContent div div .checkBtn').innerHTML = "upadte ready to install";
    } else if (UPDATER_STATUS == 'UTD') {
        document.querySelector('.parameterContent div div h2').innerHTML = '✔️ You\'re up to date'
        document.querySelector('.parameterContent div div .buttons .restartBtn').classList.add('hidden');
        document.querySelector('.parameterContent div div .buttons .checkBtn').classList.remove('hidden');
        
        // change check for update button style
        document.querySelector('.parameterContent div div .checkBtn').style.opacity = 1;
        document.querySelector('.parameterContent div div .checkBtn').style.pointerEvents = 'auto';
        document.querySelector('.parameterContent div div .checkBtn').innerHTML = "Check for Updates";

    }
}

function setDownloadProgress() {
    document.querySelector('.downloadProgress').classList.add('downloading');
    let timer = setInterval(() => {
        document.querySelector('.dlPercent').innerHTML = dlProgressObj[1]
        document.querySelector('.downloaded').innerHTML = dlProgressObj[2]
        document.querySelector('.toDownload').innerHTML = dlProgressObj[3]
        document.querySelector('.dlSpeed').innerHTML = dlProgressObj[0]
        if (dlProgressObj[1] == "100") {
            clearInterval(timer);
            console.log('download finished ! clearing interval, changing status to "UPDATE_DL"')
            document.querySelector('.downloadProgress').classList.remove('downloading');
            setUpdaterStatus()
        }
    }, 500)
}

let dlProgressObj = []

ipcRenderer.on('download-progress', (event, progress) => {
    dlProgressObj = JSON.parse(progress)
})