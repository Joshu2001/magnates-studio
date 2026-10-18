const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onToggleDrawingMode: (callback) => ipcRenderer.on('toggle-drawing-mode', callback)
});
