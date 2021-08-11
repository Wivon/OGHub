let CtrlIsPressed = false

let minimizeBtn = document.querySelector('.minimizeBtn');
let closeBtn = document.querySelector('.closeBtn');
let cardsContainer = document.querySelector('.container')
let titlebarText = document.querySelector('.titleBar .title')

minimizeBtn.addEventListener('click', () => {
    ipcRenderer.send('minimizeApp');
})

closeBtn.addEventListener('click', () => {
    ipcRenderer.send('closeApp');
})

let status

function changeTitleStatus(newStatus) {
    if (newStatus == status) {
        titlebarText.innerHTML = "OG Hub"
        status = ""
    }
    else {
        if (newStatus != "") {
            titlebarText.innerHTML = "OG Hub | " + newStatus
            status = newStatus
        }
        else {
            titlebarText.innerHTML = "OG Hub"
        }
    }
}

document.body.onkeydown = (key) => {
    if (key.keyCode == "123") {
        console.log('opening dev tools')
        ipcRenderer.send('openDevTools');
    }
    else if (key.keyCode == "116") {
        ipcRenderer.send('restart');
    }
    else if (key.keyCode == "81") {
        if (CtrlIsPressed = true) {
            ipcRenderer.send('quitApp');
        }
    }
    if (key.keyCode == 17) {
        CtrlIsPressed = true
        console.log('ctrl key is down')
    }
}

document.body.onkeyup = (key) => {
    if (key.keyCode == 17) {
        CtrlIsPressed = false
        console.log('ctrl key is up')
    }
}

// footer buttons
document.querySelector('.quitBtn').addEventListener('click', () => {
    ipcRenderer.send('quitApp')
})

document.querySelector('.editCardsBtn').addEventListener('click', () => {
    // edit card
    cardsContainer.classList.toggle('editing')
    changeTitleStatus('Editing cards')
})