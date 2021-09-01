const { ipcRenderer } = require('electron');
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
});

ipcRenderer.on('update_downloaded', () => {
    ipcRenderer.removeAllListeners('update_downloaded');
    message.innerText = 'ℹ️ New Update Downloaded. install on restart';
    restartButton.classList.remove('hidden');
    notification.classList.remove('hidden');
    
    // update in settings
    UPDATER_STATUS = 'UPDATE_DL'
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
    } else if (UPDATER_STATUS == 'UPDATE_DL') {
        document.querySelector('.parameterContent div div h2').innerHTML = "ℹ️ New Update Downloaded. install on restart."
        document.querySelector('.parameterContent div div .buttons .restartBtn').classList.remove('hidden');
    } else if (UPDATER_STATUS == 'UTD') {
        document.querySelector('.parameterContent div div h2').innerHTML = '✔️ You\'re up to date'
        document.querySelector('.parameterContent div div .buttons .restartBtn').classList.add('hidden');
    }
}