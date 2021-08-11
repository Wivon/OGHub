const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron');
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
  });

  mainWindow.loadFile('content/index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });

}

app.on('ready', () => {
  createWindow()
});

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

function restart () {
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

ipcMain.on('closeApp', () => {
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

// if (app.requestSingleInstanceLock() == false) {

// }