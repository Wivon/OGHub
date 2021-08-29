const { ipcRenderer } = require('electron');
// update notification
const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');

ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available');
    message.innerText = 'A new update is available. Downloading now...';
    notification.classList.remove('hidden');

    // update in settings
    document.querySelector('.parameterContent div div h2').innerHTML = "ℹ️ Update available ! downloading..."
});

ipcRenderer.on('update_downloaded', () => {
    ipcRenderer.removeAllListeners('update_downloaded');
    message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
    restartButton.classList.remove('hidden');
    notification.classList.remove('hidden');
    
    // update in settings
    document.querySelector('.parameterContent div div h2').innerHTML = "ℹ️ New Update Downloaded. install on restart."
    document.querySelector('.parameterContent div div .buttons .restartBtn').classList.remove('hidden');
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