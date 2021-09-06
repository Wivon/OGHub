const appdata = process.env.APPDATA

let SelectedExePath = ""

function SelectExecutable() {
    document.querySelector('.selectExeBtn').innerHTML = "Select Executable"

    ipcRenderer.invoke("select-exe").then(response => {
        SelectedExePath = response.filePaths[0]
        document.querySelector('.selectExeBtn').innerHTML = document.querySelector('.selectExeBtn').innerHTML + ' (' + SelectedExePath.split('\\')[[SelectedExePath.split('\\').length - 1]] + ')'
    })
}


function CreateShortcut() {
    console.log('creating shortcut')
    let newShortcutName = document.querySelector('.shortcutNameInput').value

    // // get exe img and write it in img/exeimg/
    // const iconExtractor = require('icon-extractor');
    // const fs = require('fs');

    // let newImgIconName = RemoveWhiteSpace(document.querySelector('.shortcutNameInput').value) + '.png'

    // iconExtractor.emitter.on('icon', function (data) {
    //     console.log('Here is my context: ' + data.Context);
    //     console.log('Here is the path it was for: ' + data.Path);
    //     var icon = data.Base64ImageData;

    //     fs.writeFile(`${appdata}/og-hub/cards/cards-img/` + newImgIconName, icon, 'base64', (err) => {
    //         console.error(err);
    //     });
    // });

    // iconExtractor.getIcon(newImgIconName, SelectedExePath);

    let newCard  = document.createElement("div");
    // et lui donne un peu de contenu
    newCard.innerHTML = '<div class="handle"></div><img src="img/logoX1024.png" alt="app icon" class="icon"><h3>'+newShortcutName+'</h3>'
    newCard.classList.add('card')
    newCard.setAttribute('onclick', 'launchExe(\''+addslashes(SelectedExePath)+'\')')
    // add in HTML
    cardsContainer.appendChild(newCard);

    setTimeout(() => {
        // save in cards/cards.json
            ipcRenderer.send('save-new-card', newShortcutName + "$$--$$" + SelectedExePath + "$$--$$")
    }, 2000)

    sendTempNotification('✔️ card added !', 3000, 'show', () => {
        showPannel('.settings', 'Settings', '<!-- no footer for this pannel (settings) -->')
    })

}

