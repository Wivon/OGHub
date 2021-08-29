const React = require('react');
const reactDOM = require('react-dom');
const appdata = process.env.APPDATA

let SelectedExePath = ""

function SelectExecutable() {
    document.querySelector('.selectExeBtn').innerHTML = "Select Executable"

    ipcRenderer.invoke("select-exe").then(response => {
        SelectedExePath = response.filePaths[0]
        document.querySelector('.selectExeBtn').innerHTML = document.querySelector('.selectExeBtn').innerHTML + ' (' + SelectedExePath.split('\\')[[SelectedExePath.split('\\').length - 1]] + ')'
    })
}

function RemoveWhiteSpace(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1);
    }).replace(/\s/g, "");
}

function CreateShortcut() {
    console.log('creating shortcut')

    // get exe img and write it in img/exeimg/
    const iconExtractor = require('icon-extractor');
    const fs = require('fs');

    let newImgIconName = RemoveWhiteSpace(document.querySelector('.shortcutNameInput').value) + '.png'

    iconExtractor.emitter.on('icon', function (data) {
        console.log('Here is my context: ' + data.Context);
        console.log('Here is the path it was for: ' + data.Path);
        var icon = data.Base64ImageData;

        fs.writeFile(`${appdata}/.og-hub/cards/cards-img/` + newImgIconName, icon, 'base64', (err) => {
            console.error(err);
        });
    });

    iconExtractor.getIcon(newImgIconName, SelectedExePath);

    setTimeout(() => {

        // using React
        let newCard = React.createElement("div", {
            className: "card"
        }, React.createElement("div", {
            className: "handle"
        }), React.createElement("img", {
            src: '${appdata}/.og-hub/cards/cards-img/' + newImgIconName,
            alt: "app icon",
            className: "icon"
        }), React.createElement("h3", null, document.querySelector('.shortcutNameInput').value));

        reactDOM.render(newCard, cardsContainer)

        // save in cards/cards.json
        ipcRenderer.send('save-new-card', document.querySelector('.shortcutNameInput').value + "$$--$$" + SelectedExePath + "$$--$$" + newImgIconName)
    }, 2000)


}
