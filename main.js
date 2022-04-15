try {
  require('electron-reloader')(module)
} catch (_) {}
// Modules to control application life and create native browser window
const {app, BrowserWindow, screen, ipcMain, ipcRenderer, globalShortcut} = require('electron')
const path = require('path')
const TrayHelper = require('./tray-helper')
let { searchEngineURL } = require('./global-data')
let { setupTitlebar, attachTitlebarToWindow } = require("custom-electron-titlebar/main");

let bromeWindow;
let bromeWidth;
let bromeHeight;
let screenWidth, screenHeight;
let childWindows = [];

// CHILD-WINDOW
function createChildWindow(url) {
  console.log("Creating child window: "+url)
  // Create the browser window.
  let childWindow = new BrowserWindow({
    width: screenWidth,
    height: screenHeight,
    backgroundColor: '#FFF',
    webPreferences: {
      preload: path.join(__dirname, 'child-preload.js'),
    },
    frame: false
  })
  attachTitlebarToWindow(childWindow);
  let index = childWindows.length;
  childWindows[index] = childWindow;

  // and load the index.html of the app.
  childWindow.loadURL(url)
  console.log("Created child window at index "+index+": " + url)
  return index;
}

function initShortcutListener(){
  globalShortcut.register('CommandOrControl+Shift+B', () => {
    bromeWindow.show()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  console.log("Initialising Brome...")
  console.log("Activating shortcut listener...")
  initShortcutListener()
  console.log("Success!")
  console.log("Creating title bar...")
  setupTitlebar();
  console.log("Success!")

  console.log("Creating main Brome window...")
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize
  screenWidth = width
  screenHeight = height
  // Create the browser window.
  bromeHeight = parseInt(height / 100 * 20, 10);// to get 20% of the screen height: height / 100 * 2 // parseInt because double not supported
  bromeWidth = parseInt(width / 100 * 40, 10);// to get 40% of the screen width
  bromeWindow = new BrowserWindow({
    width: bromeWidth,
    height: bromeHeight, 
    maxWidth: bromeWidth,
    maxHeight: bromeHeight,
    minWidth: bromeWidth,
    minHeight: bromeHeight,
    x: parseInt((primaryDisplay.size.width / 2) - (bromeWidth / 2)),
    y: parseInt((primaryDisplay.size.height / 2) - (bromeHeight / 2)),
    frame: false,
    backgroundColor: '#00FFFFFF',
    webPreferences: {
      preload: path.join(__dirname, 'brome-preload.js'),
    },
    transparent: true
  })
  bromeWindow.setAlwaysOnTop(true)
  bromeWindow.loadFile('brome.html')
  bromeWindow.webContents.openDevTools({ mode: 'detach' });

  console.log("Brome with " + bromeWidth + "px width " + bromeHeight + "px height")
  console.log("Success!")

  // ICON TRAY
  TrayHelper.setOptions({
    trayIconPath: path.join("Brome_icon.png"),
    window: bromeWindow
  });
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) bromeWindow.show()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on("win-minimize", (event, args) => {
  bromeWindow.minimize()
});
ipcMain.on("win-maximize", (event, args) => {
  bromeWindow.maximize()
});
ipcMain.on("win-unmaximize", (event, args) => {
  bromeWindow.unmaximize()
});
ipcMain.on("win-close", (event, args) => {
  bromeWindow.close()
});

// Child window events
ipcMain.on("child-win-open", (event, url) => { // Requires an url
  event.returnValue = createChildWindow(url); // Returns the newly created windows index in the child windows list
});
ipcMain.on("child-win-close", (event, windowIndex) => { // Requires the child window index
  childWindows[windowIndex].close();
});
