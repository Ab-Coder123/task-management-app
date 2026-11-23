const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('taskSaaSDesktop', {
  isDesktop: true,
  platform: process.platform,
  getVersion: () => ipcRenderer.invoke('get-app-version'),
  getAutoLaunch: () => ipcRenderer.invoke('get-auto-launch'),
  setAutoLaunch: (enabled) => ipcRenderer.invoke('set-auto-launch', Boolean(enabled)),
  showNotification: ({ title, body, route } = {}) =>
    ipcRenderer.invoke('show-notification', { title, body, route }),
  onQuickAction: (callback) => {
    if (typeof callback !== 'function') return () => {};
    const handler = (_event, action) => callback(action);
    ipcRenderer.on('quick-action', handler);
    return () => ipcRenderer.removeListener('quick-action', handler);
  },
});
