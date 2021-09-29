const { app, BrowserWindow, ipcMain, ipcRenderer, globalShortcut } = require('electron');
const ipc = ipcRenderer
const { autoUpdater } = require('electron-updater');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 700,
    height: 550,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    icon: path.join(__dirname, 'src/img/logoX512.png')
  });

  mainWindow.loadFile('content/index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

autoUpdater.on('download-progress', (progressObj) => {
  let bytePerSecond = progressObj.bytesPerSecond
  let dlPercent = progressObj.percent
  let downloaded = progressObj.transferred
  let toDownload = progressObj.total
  let response = [bytePerSecond, dlPercent, downloaded, toDownload]
  mainWindow.webContents.send('download-progress', JSON.stringify(response));
})

ipcMain.on('checkForUpdates', () => {
  autoUpdater.checkForUpdatesAndNotify();
})

app.on('ready', () => {
  createWindow()
  console.log(`app version: ${app.getVersion()}`)

  globalShortcut.register('Alt+CommandOrControl+I', () => {
    mainWindow.show()
  })
});

ipcMain.handle('og-hub-version', (event, arg) => {
  return app.getVersion();
})

ipcMain.on('set-resizable', () => {
  mainWindow.setResizable(true)
  console.log('mainWindow.isResizable : true')
})

ipcMain.on('set-fullscrenable', (event, msg) => {
  if (msg === 'true') {
    mainWindow.setFullscree
  } else {
    mainWindow.setResizable(false);
  }
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

function restart() {
  app.relaunch()
  app.exit()
}
// auto updater
autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

// main window ipc functions
ipcMain.on('openDevTools', () => {
  console.log('opening dev tools')
  mainWindow.webContents.openDevTools()
})

ipcMain.on('minimizeApp', () => {
  mainWindow.minimize()
  console.log('app minimized')
});

ipcMain.on('quitApp', () => {
  app.quit()
});

ipcMain.on('quitApp', () => {
  app.quit()
});

ipcMain.on('hideApp', () => {
  mainWindow.hide()
});

ipcMain.on('restart', () => {
  restart()
});

// tray icon
const { Menu, Tray } = require('electron')

let tray = null

app.whenReady().then(() => {

  const trayIcnName = 'logoX512.png';
  const trayIcnPath = process.env.WEBPACK_DEV_SERVER_URL
    ? path.join(__dirname, `/app.asar/src/img/${trayIcnName}`)
    : path.join(__dirname, `/src/img/${trayIcnName}`);

  tray = new Tray(trayIcnPath)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'restart',
      click() { restart() }
    },
    {
      label: 'Check for Updates',
      click() { autoUpdater.checkForUpdatesAndNotify(); }
    },
    {
      label: 'Dev tools',
      click() { mainWindow.webContents.openDevTools() }
    },
    {
      label: 'Quit',
      click() { app.quit(); }
    }
  ])
  tray.setToolTip('OG Hub is running in background')
  tray.setContextMenu(contextMenu)
  tray.on('click', function () {
    mainWindow.show()
  })
})

const { dialog } = require('electron')

// exe importer
ipcMain.handle('select-exe', (event, arg) => {
  console.log('opening file explorer')
  return dialog.showOpenDialog({ properties: ['openFile'] })
})

ipcMain.on('save-new-card', (event, msg) => {
  console.log(msg)
})

// exe launcher
const child = require('child_process').execFile;

ipcMain.on('launch-exe', (event, exePath) => {
  child(exePath, function (err, data) {
    if (err) {
      console.error(err);
      return;
    }

    console.log(data.toString());
  });
})

// options in options.json
const fs = require('fs');
const fileName = app.getPath("appData") + "\\og-hub\\options.txt";
const DEFAULT_OPTIONS = '{"autoUpdate": true,"backgroundRunning": true,"backgroundMode": "backgroundColor","theme": "dark","backgroundColor": "#1f1f1f","textColor": "#f1f1f1","accentColor": "#0092e6","UseOnlineApp": "true","startWithWindows": false,"dragAndDrop": false,"zoolLevel": "100"}'

function readOptionsJSON() {
  if (fs.exists(fileName, () => { console.log('options.txt checked') })) {
    const file = require(fileName);
    let file_content = fs.readFileSync(fileName);
    let content = JSON.parse(file_content);
    return content
  } else {
    fs.writeFile(fileName, DEFAULT_OPTIONS, function (err) {
      if (err) throw err;
    });
    let file_content = fs.readFileSync(fileName);
    let content = JSON.parse(file_content);
    return content
    console.log('options.txt file does not exist, creating...');
  }
}

function WriteOptionsJSON(optionName, option) {
  file[optionName] = option;

  fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
    if (err) return console.log(err);
    console.log('writing to ' + fileName);
  });
}

ipcMain.on('save-options', (event, msg) => {
  let newOptionName = JSON.parse(msg)[0]
  let newOptionValue = JSON.parse(msg)[1]
  WriteOptionsJSON(newOptionName, newOptionValue)
})

ipcMain.handle('get-options', (event, msg = null) => {
  if (msg == null || msg == "") {
    return JSON.stringify(readOptionsJSON())
  } else {
    return readOptionsJSON()[msg]

  }
})

console.log("appdata path: " + app.getPath("appData"))


// if (app.requestSingleInstanceLock() == false) {

// }