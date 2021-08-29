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
                "paramContent": '<div class="addApp"><button class="selectExeBtn" onclick="SelectExecutable()">Select Executable</button><input class="shortcutNameInput" type="text" placeholder="shortcut name"></input><button class="CreateShortcutBtn" onclick="CreateShortcut()">Create Shortcut</button></div>',
                "openWith": "settings"
            }, {
                "paramId": "backgrndSettings",
                "paramName": "Application background",
                "paramContent": '<h2>Background color: </h2><input class="appBackgrndSelector" type="color" value="#1f1f1f"></input><button oncklick="changeBackgroundColor()">Apply</button',
                "openWith": "settings"
            }, {
                "paramId": "updates",
                "paramName": "Updates",
                "paramContent": '<div class="updateHeader"><img src="img/settings_update_icon.png"><div><h2>✔️ You are up to date</h2><h4>Last check: <span>' + LastUpdateCheckDate + '</span></h4><div class="buttons"><button class="checkBtn" onclick="CheckForUpdatesButton()">Check for Updates</button><button class="hidden restartBtn" onclick="restartApp()">restart</button></div></div></div><div class="updateInfo"><h4>Current version: ' + appVersion + ', last release changelog :</h4><br><p class="changelog">' + lastReleaseDescription + '</p></div>',
                "openWith": "settings"
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

// settings functions
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
    }, 5000)
}

// backgroundColor
function changeBackgroundColor() {
    let newBackgrndColor = document.querySelector('.appBackgrndSelector').value
    console.log(`updating background color to ${newBackgrndColor}`)
    document.body.style.backgroundColor = newBackgrndColor
}