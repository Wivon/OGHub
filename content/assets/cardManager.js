const appdata = process.env.APPDATA

let SelectedExePath = ""

function SelectExecutable() {
    ipcRenderer.invoke("select-exe").then(response => {
        SelectedExePath = response.filePaths[0]
        document.querySelector("div.parameterContent div img").style.transform = "translateX(-50%) scale(.85)"
        document.querySelector(".containerANA p").style.opacity = "0"
        setTimeout(() => {
            document.querySelector("div.parameterContent div div button.next").classList.remove('disabled')
            document.querySelector("div.parameterContent div img").style.transform = "translateX(-50%) scale(1)"
            document.querySelector('.containerANA p').innerHTML = SelectedExePath.split('\\')[[SelectedExePath.split('\\').length - 1]]
            document.querySelector("div.parameterContent div img").style.opacity = "1"
            document.querySelector(".containerANA p").style.opacity = ".75"
        }, 450)
    })
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
    newCard.innerHTML = `\n<div class="handle"></div><img src="img/logoX512.png" alt="app icon" class="icon"><h3>${newShortcutName}</h3>`
    newCard.classList.add('card')
    newCard.setAttribute('onclick', 'launchExe(\'' + addslashes(SelectedExePath) + '\')')
    // add in HTML
    cardsContainer.appendChild(newCard);

    setTimeout(() => {
        // save in cards/cards.json
        ipcRenderer.send('save-new-card', newShortcutName + "$$--$$" + SelectedExePath + "$$--$$")
    }, 2000)

    sendTempNotification('✅ card added !', 3000, 'show', () => {
        showpanel('.settings', 'Settings', '<!-- no footer for this panel (settings) -->')
    })

    // set events listener for the new card
    setCardCtxMenuEvent()
}

function deleteCard(elementSelector) {
    let element = document.querySelector(elementSelector)

    element.style.transition = 'all .3s ease-in'
    element.style.transform = "scale(0) translateX(-80%)"
    element.style.transformOrigin = 'left'
    element.style.opacity = "0"
    element.style.pointerEvents = "none"

    setTimeout(() => {
        // remove element obviously :)
        element.remove()
        saveCards()
        console.log('card removed & saved !')
    }, 350)

    // and hide the popup
    hidePopup()
}

function NextANA() {
    if (document.querySelector('.containerANA').classList.contains('stepOne')) {
        document.querySelector('.containerANA').classList.remove('stepOne')
        document.querySelector('.containerANA').classList.add('stepTwo')

        document.querySelector('.containerANA h5').style.opacity = "0"
        document.querySelector('.ActionBtnANA').style.transform = "scale(.90)"
        document.querySelector("div.parameterContent div div button.back").classList.remove('hidden')
        setTimeout(() => {
            document.querySelector('.ActionBtnANA').textContent = "Select an icon"
            document.querySelector('.ActionBtnANA').style.transform = "scale(1)"
        }, 250)

        document.querySelector('.containerANA .editor input.newCardNameInput').value = document.querySelector('.containerANA p').innerHTML
        document.querySelector('.ActionBtnANA').classList.remove('selectExeBtn')
    } else if (document.querySelector('.containerANA').classList.contains('stepTwo')) {
        document.querySelector('.containerANA').classList.remove('stepTwo')
        document.querySelector('.containerANA').classList.add('stepThree')


    } else if (document.querySelector('.containerANA').classList.contains('stepThree')) {
        CreateShortcut()
    }
}

function backANA() {
    if (document.querySelector('.containerANA').classList.contains('stepTwo')) {
        document.querySelector('.containerANA').classList.remove('stepTwo')
        document.querySelector('.containerANA').classList.add('stepOne')

        document.querySelector('.containerANA h5').style.opacity = "1"
        document.querySelector('.ActionBtnANA').style.transform = "scale(.90)"
        document.querySelector("div.parameterContent div div button.back").classList.add('hidden')
        setTimeout(() => {
            document.querySelector('.ActionBtnANA').textContent = "Select an app"
            document.querySelector('.ActionBtnANA').style.transform = "scale(1)"
        }, 250)

        document.querySelector('.ActionBtnANA').classList.add('selectExeBtn')
    } else if (document.querySelector('.containerANA').classList.contains('stepThree')) {
        document.querySelector('.containerANA').classList.remove('stepThree')
        document.querySelector('.containerANA').classList.add('stepTwo')
    }
}