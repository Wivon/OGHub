const { ipcRenderer } = require('electron');
const ipc = ipcRenderer;

let minimizeBtn = document.querySelector('minimizeBtn');

minimizeBtn.onclick = () => {
    ipc.send('IpcMinimize')
}

document.body.onkeydown = (key) => {
    if (key.keyCode == "123") {
        ipc.send('openDeveloperTools')
        console.log('sending "openDeveloperTools" with IPC')
    }
}

// update notification
const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');

ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available');
    message.innerText = 'A new update is available. Downloading now...';
    notification.classList.remove('hidden');
});

ipcRenderer.on('update_downloaded', () => {
    ipcRenderer.removeAllListeners('update_downloaded');
    message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
    restartButton.classList.remove('hidden');
    notification.classList.remove('hidden');
});

function closeNotification() {
    notification.classList.add('hidden');
}
function restartApp() {
    ipcRenderer.send('restart_app');
}