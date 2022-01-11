let minimizeBtn = document.querySelector('.minimizeBtn');
let closeBtn = document.querySelector('.closeBtn');
let cardsContainer = document.querySelector('.container')
let titlebarText = document.querySelector('.titleBar .title')
let footer = document.querySelector('footer')

let CTRL_IS_PRESSED = false

window.onload = () => {
    console.log('app ready, showing...')
    ipcRenderer.send('app-ready');
}

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

// show showpanel
function showpanel(Displaypanel, panelStatusName, newFooterContent) {
    let DisplaypanelInHtml = document.querySelector(Displaypanel)
    let panels = document.querySelectorAll('.panel')

    if (DisplaypanelInHtml.classList.contains('active')) {
        // hide panel
        cardsContainer.classList.add('active')
        DisplaypanelInHtml.classList.remove('active')

        setTimeout(() => {
            // go back in settings and account options after the animation
            backSettings()
            backAccOptions()
        }, 200)

        changeTitleStatus(panelStatusName)
        updateFooterContent(newFooterContent)
    }
    else {
        // show panel
        panels.forEach(panel => {
            if (panel.classList.contains('active')) {
                panel.classList.remove('active')
            }
        })
        DisplaypanelInHtml.classList.add('active')

        if (cardsContainer.classList.contains('editing')) {
            toggleEditCards()
        }

        changeTitleStatus(panelStatusName)
        updateFooterContent(newFooterContent)
    }
}

// settings
let settingsBtn = document.querySelector('.settingsBtn')

settingsBtn.addEventListener('click', () => {
    showpanel('.settings', 'Settings', '<!-- no footer for this panel (settings) -->')
})

// account
let AccountBtn = document.querySelector('.AccountBtn')

AccountBtn.addEventListener('click', () => {
    showpanel('.account', 'Account options', '<!-- no footer for this panel (account options) -->')
})

function quitApp() {
    document.querySelector('.titleBar').style.transform = 'translateY(-35px)';
    document.querySelector('.titleBar').style.transition = '0.3s all ease-in-out';
    document.querySelector('footer').style.transform = 'translateY(75px)';
    document.querySelector('footer').style.transition = '0.3s all ease-in-out';

    cardsContainer.style.transition = '0.3s all ease-in-out';
    cardsContainer.style.transform = 'translateY(30px)';
    cardsContainer.style.opacity = 0;
    document.querySelector('header h1').style.transition = '0.3s all ease-in-out';
    document.querySelector('header h1').style.transform = 'translateY(-30px)';
    document.querySelector('header h1').style.opacity = 0;

    document.querySelector('.settingsBtn').style.transition = '0.3s all ease-in-out';
    document.querySelector('.settingsBtn').style.transform = 'translateX(-30px) scale(1.3)';
    document.querySelector('.settingsBtn').style.opacity = 0;

    document.querySelector('.AccountBtn').style.transition = '0.3s all ease-in-out';
    document.querySelector('.AccountBtn').style.transform = 'translateX(30px) scale(1.3)';
    document.querySelector('.AccountBtn').style.opacity = 0;
    setTimeout(() => {
        saveCards()
        ipcRenderer.send('quitApp')
    }, 400)
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

let OGHUB_CONFIG = {}

function refreshOGHubOptions() {
    ipcRenderer.invoke('get-options').then(response => {
        console.log('config received', response)
        OGHUB_CONFIG = JSON.parse(JSON.parse(response))
        console.log('OGHUB_CONFIG: ' + OGHUB_CONFIG)
        onConfigReceived()
    })
}

const getOGHUB_OPTION = (option) => { return OGHUB_CONFIG[option] }

function setOptionsProperty(option, value) {
    ipcRenderer.send('save-options', JSON.stringify([option, value]))
}

function onConfigReceived() {
    initTheme()
}

refreshOGHubOptions()

// enable card animation
document.querySelectorAll('.card').forEach(card => {
    card.style.animation = 'cardDisplay .3s ease-out';

    // disable cards animation after finished the first time
    setTimeout(() => {
        document.querySelectorAll('.card').forEach(card => {
            card.style.animation = 'none';
        })
    }, 500)
})

ipcRenderer.on('goto-main-panel', () => {
    // hide OG Hub if is already visible
    if (document.hasFocus()) {
        ipcRenderer.send('minimizeApp');
    } else {
        // else show cards container if not active
        if (!cardsContainer.classList.contains('active')) {
            showpanel('.container', '', '<a onclick="toggleEditCards()">edit</a> - <a onclick="quitApp()">quit</a>')
        }
    }
})