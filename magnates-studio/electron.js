const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'Magnates Studio - On-Screen Drawing & Vector Editor',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor: '#0a0b0e',
    autoHideMenuBar: true,
    show: false
  });

  // Load from local express server or directly load file
  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, 'public', 'index.html')}`;
  mainWindow.loadURL(startUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Global hotkey to toggle fullscreen drawing focus (Ctrl+Shift+D / Cmd+Shift+D)
  globalShortcut.register('CommandOrControl+Shift+D', () => {
    if (mainWindow) {
      mainWindow.webContents.send('toggle-drawing-mode');
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
