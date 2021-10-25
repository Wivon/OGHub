// colors
let newBackgrndColor
let newTextColor
let newAccentColor

document.body.onload = () => {
    if (getOGHUB_OPTION('backgroundColor') == "undefined" || getOGHUB_OPTION('textColor') || "undefined" || getOGHUB_OPTION('accentColor') == "undefined") {
        console.warn('custom colors not defined, using default')
        newBackgrndColor = readroot.getPropertyValue('--backgrnd-color')
        newTextColor = readroot.getPropertyValue('--text-color')
        newAccentColor = readroot.getPropertyValue('--accent-color')
    } else {
        newBackgrndColor = getOGHUB_OPTION('backgroundColor')
        newTextColor = getOGHUB_OPTION('textColor')
        newAccentColor = getOGHUB_OPTION('accentColor')
    }

    refreshTheme()
}

function refreshTheme() {
    // display infos in console
    console.info(`updating background color to ${newBackgrndColor}, updating text color to ${newTextColor}, updating accent color to ${newAccentColor}`)

    // set colors variables
    root.style.setProperty('--backgrnd-color', newBackgrndColor)
    root.style.setProperty('--text-color', newTextColor)
    root.style.setProperty('--accent-color', newAccentColor)
}

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
    isLightTheme = document.querySelector('.isLightTheme')

    refreshTheme()

    // save this
    setOptionsProperty('backgroundColor', newBackgrndColor)
    setOptionsProperty('textColor', newTextColor)
    setOptionsProperty('accentColor', newAccentColor)

    root.style.getPropertyValue
}

function setColorInputValue(backgroundColor = GetThemeColors()[0].slice(1), textColor = GetThemeColors()[1].slice(1), accentColor = GetThemeColors()[2].slice(1)) {
    console.log('setting colors input value...')

    document.querySelector('.appBackgrndSelector').value = backgroundColor
    document.querySelector('.appTextColorSelector').value = textColor
    document.querySelector('.appAccentColorSelector').value = accentColor
}

function resetTheme() {
    setColorInputValue('#1f1f1f', '#f1f1f1', '#0092e6')
    changeBackgroundColor()
}