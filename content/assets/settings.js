// settings
let parameterBoxes = document.querySelectorAll('.parameterBox');
let parametersBoxesBox = document.querySelector('.parameters');
let HTMLParameterContent = document.querySelector('.parameterContent')
let backButton = document.querySelector('.backButton')
let SettingsTitle = document.querySelector('.settings .panTitle')
// account
let AccountparametersBoxesBox = document.querySelector('.account .parameters');
let HTMLAccountParameterContent = document.querySelector('.account .parameterContent')
let AccbackButton = document.querySelector('.account .backButton')
let AccSettingsTitle = document.querySelector('.account .panTitle')

// css elements
let root = document.documentElement
let readroot = getComputedStyle(document.documentElement)

// update check date
var LastUpdateCheckDateObj = new Date();
let LastUpdateCheckDate = LastUpdateCheckDateObj.toUTCString();

// app version
let appVersion
const appVersionPromise = ipcRenderer.invoke('og-hub-version')
    .then(version => {
        appVersion = version;
    })
// last release description
let settingsContent = ""

let lastReleaseDescription = ""
fetch('https://api.github.com/repos/Wivon/OGHub/releases/latest').then(response => {
    response.json().then(response => {
        lastReleaseDescription = response.body

        settingsContent = [
            {
                "paramId": "addApp",
                "paramName": "Add new app",
                "paramContent": '<div class="addApp"><button class="selectExeBtn" onclick="SelectExecutable()">Select Executable</button><button class="selectIconBtn">Selected icon: default</button><input class="shortcutNameInput" type="text" placeholder="shortcut name"></input><button class="CreateShortcutBtn" onclick="CreateShortcut()">Create Shortcut</button></div>',
                "openWith": "settings"
            }, {
                "paramId": "customize",
                "paramName": "Customization",
                "paramContent": `<h2 onshow="setColorInputValue()">Background color: </h2><input class="appBackgrndSelector" type="color" value="${GetThemeColors()[0]}"></input><br><h2>Text color: </h2><input class="appTextColorSelector" type="color" value="${GetThemeColors()[1]}"></input><br><h2>Accent color: </h2><input class="appAccentColorSelector" type="color" value="${GetThemeColors()[2]}"></input><br><input type="checkbox" name"isLightTheme" class="isLightTheme"></input><label for="isLightTheme">Enable Light Theme</label><br><button onclick="changeBackgroundColor()">Apply</button>`,
                "openWith": "settings",
                "displayAction": setColorInputValue
            }, {
                "paramId": "updates",
                "paramName": "Updates",
                "paramContent": '<div class="updateHeader"><img src="img/settings_update_icon.png"><div><h2>✔️ You\'re up to date</h2><h4>Last check: <span>' + LastUpdateCheckDate + '</span></h4><div class="buttons"><button class="checkBtn" onclick="CheckForUpdatesButton()">Check for Updates</button><button class="hidden restartBtn" onclick="restartApp()">restart</button></div></div></div><h3 class="appVersionIndicator">Current version: ' + appVersion + '</h3><div class="updateInfo">Last release changelog :<br><br><p class="changelog">' + lastReleaseDescription + '</p></div>',
                "openWith": "settings",
                "displayAction": setUpdaterStatus
            }, {
                "paramId": "shortcuts",
                "paramName": "Shortcuts",
                "paramContent": '<ul><li>Refresh: F5</li><br><li>Restart OG Hub: Ctrl + F5</li><br><li>Dev tools: F12</li><br><li>Quit OG Hub: Ctrl + Q</li></ul>',
                "openWith": "settings"
            }, {
                "paramId": "signin",
                "paramName": "Sign in",
                "paramContent": 'sign in...',
                "openWith": "account"
            }, {
                "paramId": "signup",
                "paramName": "Sign up",
                "paramContent": 'sign up...',
                "openWith": "account"
            }, {
                "paramId": "logout",
                "paramName": "Logout",
                "paramContent": 'logout...',
                "openWith": "account"
            }
        ]
    })
})

// add event listeners for openWithg parameters
parameterBoxes.forEach(paramBox => {
    paramBox.onclick = () => {
        let paramBoxId = paramBox.getAttribute('param-id')
        settingsContent.forEach(ParamContentObj => {
            if (paramBoxId == ParamContentObj.paramId) {
                console.log('opening ' + ParamContentObj.paramName + ' in settings pannel')
                if (ParamContentObj.openWith === 'settings') {
                    HTMLParameterContent.classList.add('active')
                    parametersBoxesBox.classList.add('paramHidden')
                    backButton.classList.add('active')
                    HTMLParameterContent.innerHTML = ParamContentObj.paramContent
                    SettingsTitle.innerHTML = SettingsTitle.innerHTML + ' <span> > ' + ParamContentObj.paramName + '</span>'
                    SettingsTitle.style.cursor = 'pointer';
                    setTimeout(() => {
                        parametersBoxesBox.style.height = "0";
                    }, 190)

                    if (typeof ParamContentObj.displayAction === 'undefined') {

                    } else {
                        console.log('this pannel has a displayAction, running it')
                        ParamContentObj.displayAction()
                    }
                }
                else {
                    console.log('opening ' + ParamContentObj.paramName + ' in account pannel')
                    HTMLAccountParameterContent.classList.add('active')
                    AccountparametersBoxesBox.classList.add('paramHidden')
                    AccbackButton.classList.add('active')
                    HTMLAccountParameterContent.innerHTML = ParamContentObj.paramContent
                    AccSettingsTitle.innerHTML = AccSettingsTitle.innerHTML + ' <span> > ' + ParamContentObj.paramName + '</span>'
                    AccSettingsTitle.style.cursor = 'pointer';
                    setTimeout(() => {
                        AccountparametersBoxesBox.style.height = "0";
                    }, 190)
                }
            }
        })
    }
})

// add listeners for close parameters
backButton.onclick = () => {
    backSettings()
}

SettingsTitle.onclick = () => {
    backSettings()
}

function backSettings() {
    parametersBoxesBox.style.height = "max-content";
    HTMLParameterContent.classList.remove('active')
    parametersBoxesBox.classList.remove('paramHidden')
    backButton.classList.remove('active')
    SettingsTitle.innerHTML = "Settings"
    SettingsTitle.style.cursor = 'default';
    console.log('closing pannel')
}
// add listeners for close parameters for acc
AccbackButton.onclick = () => {
    backAccOptions()
}

AccSettingsTitle.onclick = () => {
    backAccOptions()
}

function backAccOptions() {
    AccountparametersBoxesBox.style.height = "max-content";
    HTMLAccountParameterContent.classList.remove('active')
    AccountparametersBoxesBox.classList.remove('paramHidden')
    AccbackButton.classList.remove('active')
    AccSettingsTitle.innerHTML = "Account Options"
    AccSettingsTitle.style.cursor = 'default';
    console.log('closing pannel')
}

// update
function CheckForUpdatesButton() {
    console.log('checking for updates')
    // get date
    LastUpdateCheckDateObj = new Date();
    LastUpdateCheckDate = LastUpdateCheckDateObj.toUTCString();
    console.log('getting date')

    document.querySelector('.parameterContent .updateHeader img').classList.add('active')
    document.querySelector('.parameterContent div div .checkBtn').style.opacity = 0.5;
    document.querySelector('.parameterContent div div .checkBtn').style.pointerEvents = 'none';
    document.querySelector('.parameterContent div div .checkBtn').innerHTML = "Checking for Updates...";
    document.querySelector('.parameterContent div div h4 span').innerHTML = LastUpdateCheckDate;
    console.log('updating pannel view')

    sendCheckForUpdate()
    console.log('sending with ipc')

    setTimeout(() => {
        document.querySelector('.parameterContent .updateHeader img').classList.remove('active')
        document.querySelector('.parameterContent div div .checkBtn').style.opacity = 1;
        document.querySelector('.parameterContent div div .checkBtn').style.pointerEvents = 'auto';
        document.querySelector('.parameterContent div div .checkBtn').innerHTML = "Check For Updates";
        console.log('check finished succefuly')
        setUpdaterStatus()
    }, 5000)
}