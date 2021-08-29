const launchExe = function (exePath) {
    ipcRenderer.send('launch-exe', exePath)
}