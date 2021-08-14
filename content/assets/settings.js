let parameterBoxes = document.querySelectorAll('.parameterBox');
let parametersBoxesBox = document.querySelector('.parameters');
let HTMLParameterContent = document.querySelector('.parameterContent')
let backButton = document.querySelector('.backButton')
let SettingsTitle = document.querySelector('.settings .panTitle')

const settingsContent = [
    {
        "paramId": "addApp",
        "paramName": "Add new app",
        "paramContent": 'dzdzdz'
    }, {
        "paramId": "backgrndSettings",
        "paramName": "Application background",
        "paramContent": 'dzdzdz'
    }
]

parameterBoxes.forEach(paramBox => {
    paramBox.onclick = () => {
        let paramBoxId = paramBox.getAttribute('param-id')
        settingsContent.forEach(ParamContentObj => {
            if (paramBoxId == ParamContentObj.paramId) {
                HTMLParameterContent.classList.add('active')
                parametersBoxesBox.classList.add('paramHidden')
                backButton.classList.add('active')
                HTMLParameterContent.innerHTML = ParamContentObj.paramContent
                SettingsTitle.innerHTML = SettingsTitle.innerHTML + ' <span> > ' + ParamContentObj.paramName + '</span>'
            }
        })
    }
})

backButton.onclick = () => {
    HTMLParameterContent.classList.remove('active')
    parametersBoxesBox.classList.remove('paramHidden')
    backButton.classList.remove('active')
    SettingsTitle.innerHTML = "Settings"
}
