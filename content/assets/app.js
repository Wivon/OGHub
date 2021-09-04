
let minimizeBtn = document.querySelector('.minimizeBtn');
let closeBtn = document.querySelector('.closeBtn');
let cardsContainer = document.querySelector('.container')
let titlebarText = document.querySelector('.titleBar .title')
let footer = document.querySelector('footer')

let CTRL_IS_PRESSED = false

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
            titlebarText.innerHTML = "OG Hub | <span>" + newStatus + "</span>"
            status = newStatus
        }
        else {
            titlebarText.innerHTML = "OG Hub"
        }
    }
}

let footerContent

function updateFooterContent(newContent) {
    if (newContent == footerContent) {
        footer.innerHTML = '<a onclick="toggleEditCards()">edit</a> - <a onclick="quitApp()">quit</a>'
        footerContent = ""
    }
    else {
        if (newContent != "") {
            footer.innerHTML = newContent
            footerContent = newContent
        }
        else {
            footer.innerHTML = '<a onclick="toggleEditCards()">edit</a> - <a onclick="quitApp()">quit</a>'
        }
    }
}

document.body.onkeydown = (key) => {
    if (key.keyCode == "123") {
        console.log('opening dev tools')
        ipcRenderer.send('openDevTools');
    }
    else if (key.keyCode == "116") {
        if (CTRL_IS_PRESSED) {
            ipcRenderer.send('restart');
        } else {
            window.location.href = window.location.href
        }
    }
    else if (key.keyCode == "81") {
        if (CTRL_IS_PRESSED) {
            ipcRenderer.send('quitApp');
        }
    }
    if (key.keyCode == 17) {
        CTRL_IS_PRESSED = true
        console.log('ctrl key is down')
    }
}

document.body.onkeyup = (key) => {
    if (key.keyCode == 17) {
        CTRL_IS_PRESSED = false
        console.log('ctrl key is up')
    }
}

// footer buttons
function toggleEditCards() {
    // edit card
    cardsContainer.classList.toggle('editing')
    changeTitleStatus('Editing cards')
    console.log('toggle edit mode')
}

function quitApp() {
    ipcRenderer.send('quitApp')
}

// show showPannel
function showPannel(Displaypannel, pannelStatusName, newFooterContent) {
    let DisplayPannelInHtml = document.querySelector(Displaypannel)
    let pannels = document.querySelectorAll('.pannel')

    if (DisplayPannelInHtml.classList.contains('active')) {
        // hide pannel
        DisplayPannelInHtml.classList.remove('active')
        cardsContainer.classList.add('active')

        changeTitleStatus(pannelStatusName)
        updateFooterContent(newFooterContent)
    }
    else {
        // show pannel
        pannels.forEach(pannel => {
            if (pannel.classList.contains('active')) {
                pannel.classList.remove('active')
            }
        })
        DisplayPannelInHtml.classList.add('active')

        if (cardsContainer.classList.contains('editing')) {
            toggleEditCards()
        }

        changeTitleStatus(pannelStatusName)
        updateFooterContent(newFooterContent)
    }
}

// settings
let settingsBtn = document.querySelector('.settingsBtn')

settingsBtn.addEventListener('click', () => {
    showPannel('.settings', 'Settings', '<!-- no footer for this pannel (settings) -->')
})

// account
let AccountBtn = document.querySelector('.AccountBtn')

AccountBtn.addEventListener('click', () => {
    showPannel('.account', 'Account options', '<!-- no footer for this pannel (account options) -->')
})

function quitApp() {
    savePageState(cardsContainer.innerHTML)
    ipcRenderer.send('quitApp')
}