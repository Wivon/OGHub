// colors
let newBackgrndColor
let newTextColor
let newAccentColor

function initTheme() {
    if (getOGHUB_OPTION('backgroundColor') == "undefined" || getOGHUB_OPTION('textColor') == "undefined" || getOGHUB_OPTION('accentColor') == "undefined") {
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
    newBackgrndColor = document.querySelector('.appBackgrndSelector').value
    newTextColor = document.querySelector('.appTextColorSelector').value
    newAccentColor = document.querySelector('.appAccentColorSelector').value
    isLightTheme = document.querySelector('.isLightTheme')

    // save this
    if (newBackgrndColor != readroot.getPropertyValue('--backgrnd-color')) {
        setOptionsProperty('backgroundColor', newBackgrndColor)
    }
    if (newTextColor != readroot.getPropertyValue('--text-color')) {
        setOptionsProperty('textColor', newTextColor)
    }
    if (newAccentColor != readroot.getPropertyValue('--accent-color')) {
        setOptionsProperty('accentColor', newAccentColor)
    }
    // if (isLightTheme !== readroot.getPropertyValue('TO_DEFINE').slice(1)) {
    //     setOptionsProperty('theme', isLightTheme)
    // }
    // WIP: coming in next updates or this option will become automatic

    // get colors from inputs
    refreshTheme()
}

function setColorInputValue(backgroundColor = GetThemeColors()[0], textColor = GetThemeColors()[1], accentColor = GetThemeColors()[2]) {
    console.log('setting colors input value...')

    document.querySelector('.appBackgrndSelector').value = backgroundColor
    document.querySelector('.appTextColorSelector').value = textColor
    document.querySelector('.appAccentColorSelector').value = accentColor
}

function resetTheme() {
    setColorInputValue('#1f1f1f', '#f1f1f1', '#3781f8')
    changeBackgroundColor()
}