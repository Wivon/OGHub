function sendTempNotification(text, miliseconds, button=null, buttonShowAcction=null) {
    ipcRenderer.removeAllListeners('update_available');
    message.innerText = text;
    notification.classList.remove('hidden');

    setTimeout(() => {
        notification.classList.add('hidden');
    }, miliseconds)
}

function hideNotification() {

}