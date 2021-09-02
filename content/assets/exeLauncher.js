function launchExe (exePath) {
    ipcRenderer.send('launch-exe', exePath)
}