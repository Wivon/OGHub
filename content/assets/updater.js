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
        
        // change check for update button style
        document.querySelector('.parameterContent div div .checkBtn').style.opacity = 0.5;
        document.querySelector('.parameterContent div div .checkBtn').style.pointerEvents = 'none';
        document.querySelector('.parameterContent div div .checkBtn').innerHTML = "downloading update...";

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