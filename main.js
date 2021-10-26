const { app, BrowserWindow, ipcMain, ipcRenderer, globalShortcut } = require('electron');
const ipc = ipcRenderer
const { autoUpdater } = require('electron-updater');
const path = require('path');
const installedWinApps = require('installed-win-apps')

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
const fileName = app.getPath("appData") + "\\OG Hub\\options.json";
const DEFAULT_OPTIONS = '{"autoUpdate": true,"backgroundRunning": true,"backgroundMode": "backgroundColor","theme": "dark","backgroundColor": "#1f1f1f","textColor": "#f1f1f1","accentColor": "#3781f8","UseOnlineApp": false,"startWithWindows": false,"dragAndDrop": false,"zoomLevel": "100"}'

function readOptionsJSON() {
  return new Promise(function (resolve, reject) {
    let file_content
    if (fs.existsSync(fileName)) {
      console.log('options.txt exists, reading...')
      file_content = fs.readFileSync(fileName, "utf-8");
    } else {
      console.log('options.txt file does not exist, creating...');
      fs.writeFile(fileName, DEFAULT_OPTIONS, function (err) {
        if (err) throw err;
        console.log('file created, reading...')
        file_content = fs.readFileSync(fileName, "utf-8");
      })
    }
    resolve(file_content)
    reject('error')
  })
}

function WriteOptionsJSON(optionName, option) {
  let file
  readOptionsJSON().then(response => {
    file = response
    file[optionName] = option;

    console.log(file)

    fs.writeFile(fileName, file, function writeJSON(err) {
      if (err) return console.log(err);
      console.log('writing to ' + fileName);
    });
  })
}

ipcMain.on('save-options', (event, msg) => {
  WriteOptionsJSON(JSON.parse(msg)[0], JSON.parse(msg)[1])
})

ipcMain.handle('get-options', (event) => {
  return readOptionsJSON().then(response => {
    return JSON.stringify(response)
  })
})

console.log("appdata path: " + app.getPath("appData"))

// installedWinApps.getAllPaths().then(paths => {
//   console.log(paths)   //paths is an array that contains the paths of all installed apps
// })

// if (app.requestSingleInstanceLock() == false) {

// }