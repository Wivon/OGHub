function sendTempNotification(text, miliseconds, button = null, buttonShowAcction = null) {
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

    // hide the notif with anim after delay indicated miliseconds
    setTimeout(() => {
        hideNotification(true)
    }, miliseconds)

    if (!document.querySelector('#notification #restart-button').classList.contains('hidden')) {
        document.querySelector('#notification #restart-button').classList.add('hidden')
    }
}

function hideNotification(animation) {
    if (animation == false) {
        // if not animation, just hide it :)
        notification.classList.add('hidden');
    } else if (animation == true) {
        // exit the notif from the screen
        notification.style.transition = ".4s ease-in"
        notification.style.bottom = "-75px"

        // reset the notif style.
        setTimeout(() => {
            notification.classList.add('hidden');
            notification.style.transition = ".2s ease-in"
            notification.style.bottom = "20px"
        }, 505)
    }
}