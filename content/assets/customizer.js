// backgroundColor

let newBackgrndColor
let newTextColor
let newAccentColor

function GetThemeColors() {
    if (typeof newBackgrndColor !== 'undefined' && typeof newTextColor !== 'undefined' && typeof newAccentColor !== 'undefined') {
        return [newBackgrndColor, newTextColor, newAccentColor]
    }
    else {
        console.log('custom colors variables are not defined, displaying default')
        return [readroot.getPropertyValue('--backgrnd-color').slice(1), readroot.getPropertyValue('--text-color').slice(1), readroot.getPropertyValue('--accent-color').slice(1)]
    }
}

function changeBackgroundColor() {
    // get colors from inputs
    newBackgrndColor = document.querySelector('.appBackgrndSelector').value
    newTextColor = document.querySelector('.appTextColorSelector').value
    newAccentColor = document.querySelector('.appAccentColorSelector').value

    // display infos in console
    console.info(`updating background color to ${newBackgrndColor}, updating text color to ${newTextColor}, updating accent color to ${newAccentColor}`)

    // set colors variables
    root.style.setProperty('--backgrnd-color', newBackgrndColor)
    root.style.setProperty('--text-color', newTextColor)
    root.style.setProperty('--accent-color', newAccentColor)

    root.style.getPropertyValue
}

function setColorInputValue() {
    console.log('setting colors input value...')

    document.querySelector('.appBackgrndSelector').value = GetThemeColors()[0]
    document.querySelector('.appTextColorSelector').value = GetThemeColors()[1]
    document.querySelector('.appAccentColorSelector').value = GetThemeColors()[2]
}