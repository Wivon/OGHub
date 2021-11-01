function launchExe (exePath) {
    if (!cardsContainer.classList.contains('editing')) {
        ipcRenderer.send('launch-exe', exePath)
    }
}