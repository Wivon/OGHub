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
    ipcRenderer.send('hideApp');
    console.log('closeBtn clicked, closing app')
})

let Titlestatus

function changeTitleStatus(newStatus) {
    if (newStatus == Titlestatus) {
        titlebarText.innerHTML = "OG Hub"
        Titlestatus = ""
    }
    else {
        if (newStatus != "") {
            titlebarText.innerHTML = "OG Hub | <span>" + newStatus + "</span>"
            Titlestatus = newStatus
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

document.body.onkeydown = (event) => {
    if (event.keyCode == "123") {
        console.log('opening dev tools')
        ipcRenderer.send('openDevTools');
    }
    else if (event.keyCode == "116") {
        if (CTRL_IS_PRESSED) {
            ipcRenderer.send('restart');
        } else {
            window.location.href = window.location.href
        }
    }
    else if (event.keyCode == "81") {
        if (CTRL_IS_PRESSED) {
            ipcRenderer.send('quitApp');
        }
    } else if (event.keyCode == "27") {
        event.preventDefault();
        ipcRenderer.send('minimizeApp');
    }
    if (event.keyCode == 17) {
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

function setResizable() {
    ipcRenderer.send('set-resizable')
}

function setResizable(boolean) {
    ipcRenderer.send('set-fullscreenable', boolean)
}

function setZoomLevel(level) {
    document.body.style.zoom = level + "%";
    console.log('zoom level changed to ' + level)
}

document.body.onclick = () => {
    savePageState(content.innerHTML)
    hideContextMenus()
}

let OGHUB_CONFIG = {}

function refreshOGHubOptions() {
    ipcRenderer.invoke('get-options').then(response => {
        console.log('config received')
        console.log(response)
        OGHUB_CONFIG = JSON.stringify(response)
    })
}

function getOGHUB_OPTION(option) {
    return OGHUB_CONFIG[option]
}

function setOptionsProperty(option, value) {
    ipcRenderer.send('save-options', JSON.stringify([option, value]))
}

refreshOGHubOptions()

// disable cards animation after finished the first time
// setTimeout(() => {
//     document.querySelectorAll('.card').forEach(card => {
//         card.style.animation = 'none';
//     })
// },500)