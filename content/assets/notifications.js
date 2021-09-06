function sendTempNotification(text, miliseconds, button=null, buttonShowAcction=null) {
    ipcRenderer.removeAllListeners('update_available');
    message.innerText = text;
    notification.classList.remove('hidden');

    if (button != null) {
        document.querySelector('.customBtn').innerHTML = button
        document.querySelector('.customBtn').classList.remove('hidden');

        if (buttonShowAcction != null) {
            document.querySelector('.customBtn').onclick = () => {
                buttonShowAcction()
                hideNotification(false)
            }
        }
    } else {
        document.querySelector('.customBtn').classList.add('hidden');
    }

    setTimeout(() => {
        hideNotification(true)
    }, miliseconds)
}

function hideNotification(animation) {
    if (animation == false) {
        notification.classList.add('hidden');
    } else if (animation == true) {
        notification.style.transition = ".4s ease-in"
        notification.style.bottom = "-75px"

        setTimeout(() => {
            notification.classList.add('hidden');
            notification.style.transition = ".2s ease-in"
            notification.style.bottom = "20px"
        }, 505)
    }
}