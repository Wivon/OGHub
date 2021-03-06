const appdata = process.env.APPDATA

let SelectedExePath = ""

function MainActionANA() {
    if (document.querySelector('.containerANA').classList.contains('stepOne')) {
        ipcRenderer.invoke("select-exe").then(response => {
            SelectedExePath = response.filePaths[0]
            if (SelectedExePath) {
                document.querySelector("div.parameterContent div img").style.transform = "translateX(-50%) scale(.85)"
                document.querySelector(".containerANA p").style.opacity = "0"
                setTimeout(() => {
                    document.querySelector("div.parameterContent div div button.next").classList.remove('disabled')
                    document.querySelector("div.parameterContent div img").style.transform = "translateX(-50%) scale(1)"
                    document.querySelector('.containerANA p').innerHTML = SelectedExePath.split('\\')[[SelectedExePath.split('\\').length - 1]]
                    document.querySelector("div.parameterContent div img").style.opacity = "1"
                    document.querySelector(".containerANA p").style.opacity = ".75"
                }, 450)
            }
        })
    } else if (document.querySelector('.containerANA').classList.contains('stepTwo')) {
        // select icon code
    } else if (document.querySelector('.containerANA').classList.contains('stepThree')) {
        CreateShortcut()
        document.querySelector('.ActionBtnANA').textContent = "Add Another App"
        document.querySelector('.containerANA').classList.remove('stepThree')
        document.querySelector('.containerANA').classList.add('askForAddAnother')
    } else if (document.querySelector('.containerANA').classList.contains('askForAddAnother')) {
        document.querySelector('.containerANA').classList.remove('askForAddAnother')
        document.querySelector('.containerANA').classList.add('stepThree')
        document.querySelector('.containerANA p').innerHTML = "your-app.exe"
        document.querySelector('.containerANA img').src = "img/logoX512.png"
        document.querySelector("div.parameterContent div div button.next").classList.add('disabled')
        document.querySelector("div.parameterContent div img").style.transform = "translateX(-50%) scale(.85)"
        backANA()
        backANA()
    }
}


function CreateShortcut() {
    console.log('creating shortcut')
    let newShortcutName = document.querySelector('.newCardNameInput').value

    // get exe img and write it in a folder
    // const iconExtractor = require('icon-extractor');
    // const fs = require('fs');

    // let newImgIconName = RemoveWhiteSpace(document.querySelector('.shortcutNameInput').value) + '.png'

    // iconExtractor.emitter.on('icon', function (data) {
    //     console.log('Here is my context: ' + data.Context);
    //     console.log('Here is the path it was for: ' + data.Path);
    //     var icon = data.Base64ImageData;

    //     fs.writeFile(`${appdata}/OG Hub/cards/cards-img/` + newImgIconName, icon, 'base64', (err) => {
    //         console.error(err);
    //     });
    // });

    // iconExtractor.getIcon(newImgIconName, SelectedExePath);

    let newCard = document.createElement("div");
    // et lui donne un peu de contenu
    newCard.innerHTML = `\n<div class="handle"></div><img src="${document.querySelector('.containerANA img').src}" alt="app icon" class="icon"><h3>${newShortcutName}</h3>`
    newCard.classList.add('card')
    newCard.setAttribute('onclick', 'launchExe(\'' + addslashes(SelectedExePath) + " " + document.querySelector('.newCardArgsInput').value + '\')')
    // add in HTML
    cardsContainer.appendChild(newCard);

    setTimeout(() => {
        // save in cards/cards.json
        ipcRenderer.send('save-new-card', newShortcutName + "$$--$$" + SelectedExePath + "$$--$$")
    }, 2000)

    sendTempNotification('??? card added !', 3000, 'show', () => {
        showpanel('.settings', 'Settings', '<!-- no footer for this panel (settings) -->')
    })

    // set events listener for the new card
    setCardCtxMenuEvent()
}

function deleteCard(elementSelector) {
    let element = document.querySelector(elementSelector)

    element.style.transition = 'all .2s ease-out'
    element.style.transform = "scale(.3)"
    element.style.opacity = "0"
    element.style.pointerEvents = "none"
    element.style.width = "0"

    setTimeout(() => {
        // remove element obviously :)
        element.remove()
        saveCards()
        console.log('card removed & saved !')
    }, 250)

    // and hide the popup
    hidePopup()
}

const CONTAINER_ANA_TITLES = ['Let\'s add an app !', 'Card Personalization', 'Alright ?']
const CONTAINER_ANA_MAIN_BTN = ['select an app', 'select an icon', 'Create card !']

function AnimateButtonText(elementSelector, newText, transitionDuration=250) {
    elementSelector.style.transform = "scale(.90)"

    setTimeout(() => {
        elementSelector.textContent = newText
        elementSelector.style.transform = "scale(1)"
    }, transitionDuration)
}

function NextANA() {
    if (document.querySelector('.containerANA').classList.contains('stepOne')) {
        document.querySelector('.containerANA').classList.remove('stepOne')
        document.querySelector('.containerANA').classList.add('stepTwo')
        document.querySelector('.containerANA .editor input.newCardNameInput').value = document.querySelector('.containerANA p').innerHTML

        // args and auto name
        fetch('assets/args.json').then(res => {
            res.json().then(response => {
                response.forEach(r => {
                    if (SelectedExePath.includes(r.require)) {
                        document.querySelector('.newCardArgsInput').value = r.args
                        sendTempNotification(r.appName+" has been recognized", 2000)
                        document.querySelector('.containerANA p').textContent = r.appName
                        document.querySelector('.newCardNameInput').value = r.appName
                        if(typeof r.icon !== 'undefined') {
                            document.querySelector('.containerANA img').src = r.icon
                            console.log('importing icon ('+r.icon+') for this app')
                        }
                    }
                })
        })})

        document.querySelector('.containerANA h5').style.opacity = "0"
        document.querySelector('.containerANA h5').style.transform = "translateY(-5px)"
        document.querySelector("div.parameterContent div div button.back").classList.remove('hidden')

        AnimateButtonText(document.querySelector('.ActionBtnANA'), CONTAINER_ANA_MAIN_BTN[1])

        document.querySelector('.ActionBtnANA').classList.remove('selectExeBtn')
        AnimateButtonText(document.querySelector('.containerANA h2'), CONTAINER_ANA_TITLES[1])
    } else if (document.querySelector('.containerANA').classList.contains('stepTwo')) {
        document.querySelector('.containerANA').classList.remove('stepTwo')
        document.querySelector('.containerANA').classList.add('stepThree')
        AnimateButtonText(document.querySelector('.containerANA h2'), CONTAINER_ANA_TITLES[2])

        AnimateButtonText(document.querySelector('.ActionBtnANA'), CONTAINER_ANA_MAIN_BTN[2])

        document.querySelector("div.parameterContent div div button.next").classList.add('hidden')
    }
}

function backANA() {
    if (document.querySelector('.containerANA').classList.contains('stepTwo')) {
        document.querySelector('.containerANA').classList.remove('stepTwo')
        document.querySelector('.containerANA').classList.add('stepOne')

        document.querySelector('.containerANA h5').style.opacity = "1"
        document.querySelector('.containerANA h5').style.transform = "translateY(0px)"
        document.querySelector("div.parameterContent div div button.back").classList.add('hidden')
        
        AnimateButtonText(document.querySelector('.ActionBtnANA'), CONTAINER_ANA_MAIN_BTN[0])

        document.querySelector('.ActionBtnANA').classList.add('selectExeBtn')
        AnimateButtonText(document.querySelector('.containerANA h2'), CONTAINER_ANA_TITLES[0])
    } else if (document.querySelector('.containerANA').classList.contains('stepThree')) {
        document.querySelector('.containerANA').classList.remove('stepThree')
        document.querySelector('.containerANA').classList.add('stepTwo')
        AnimateButtonText(document.querySelector('.containerANA h2'), CONTAINER_ANA_TITLES[1])

        document.querySelector("div.parameterContent div div button.next").classList.remove('hidden')
        
        AnimateButtonText(document.querySelector('.ActionBtnANA'), CONTAINER_ANA_MAIN_BTN[1])
    }
}