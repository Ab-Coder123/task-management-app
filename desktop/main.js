const path = require('path');
const {
  app,
  BrowserWindow,
  Menu,
  Tray,
  Notification,
  globalShortcut,
  ipcMain,
  nativeImage,
  shell,
} = require('electron');

const IS_SMOKE_TEST = process.argv.includes('--smoke-test');
const APP_URL = process.env.TASKSAAS_APP_URL || 'https://taskmanagement-frontend-one.vercel.app';
const APP_ORIGIN = new URL(APP_URL).origin;

let mainWindow = null;
let tray = null;
let isQuitting = false;

function getIconPath(preferIco = false) {
  const filename = preferIco && process.platform === 'win32' ? 'icon.ico' : 'icon.png';
  return path.join(__dirname, 'build', filename);
}

function buildOfflineHtml(failedUrl) {
  const safeTarget = String(failedUrl || APP_URL).replace(/"/g, '&quot;');
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>تعذر الاتصال — TaskSaaS</title>
  <style>
    * { box-sizing: border-box; font-family: "Segoe UI", Tahoma, Arial, sans-serif; }
    body {
      margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: #0b1120; color: #f8fafc; padding: 24px;
    }
    .card {
      max-width: 420px; width: 100%; background: #101828; border-radius: 20px;
      padding: 32px; text-align: center; box-shadow: 0 24px 60px -12px rgba(0,0,0,0.65);
    }
    h1 { margin: 0 0 10px; font-size: 22px; }
    p { margin: 0 0 24px; font-size: 14px; line-height: 1.7; color: #94a3b8; }
    button {
      border: 0; border-radius: 12px; background: #2563eb; color: #fff;
      padding: 12px 24px; font-size: 14px; font-weight: 600; cursor: pointer;
    }
    button:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <div class="card">
    <h1>تعذر الاتصال بخادم TaskSaaS</h1>
    <p>تأكد من اتصالك بالإنترنت ثم أعد المحاولة لفتح لوحة المهام الخاصة بك.</p>
    <button onclick="window.location.href='${safeTarget}'">إعادة المحاولة</button>
  </div>
</body>
</html>`;
}

function showAndFocusWindow(targetPath) {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createMainWindow(targetPath);
    return;
  }
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
  if (targetPath) {
    mainWindow.loadURL(`${APP_ORIGIN}${targetPath}`);
  }
}

function createMainWindow(initialPath = '') {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    title: 'TaskSaaS',
    icon: getIconPath(true),
    backgroundColor: '#0b1120',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      partition: 'persist:tasksaas',
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  Menu.setApplicationMenu(null);

  mainWindow.once('ready-to-show', () => {
    if (!IS_SMOKE_TEST) {
      mainWindow.show();
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    try {
      const parsed = new URL(url);
      if (parsed.origin === APP_ORIGIN) {
        return { action: 'allow' };
      }
    } catch {
      // Fallback to external shell open for non-standard URLs
    }
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, _desc, validatedURL, isMainFrame) => {
    if (!isMainFrame || errorCode === -3) return;
    mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(buildOfflineHtml(validatedURL))}`);
  });

  mainWindow.on('close', (event) => {
    if (!isQuitting && !IS_SMOKE_TEST) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  const targetUrl = initialPath ? `${APP_ORIGIN}${initialPath}` : APP_URL;
  if (!IS_SMOKE_TEST) {
    mainWindow.loadURL(targetUrl);
  }
}

function refreshTrayMenu() {
  if (!tray) return;
  const loginSettings = app.getLoginItemSettings();
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'فتح TaskSaaS',
      click: () => showAndFocusWindow(),
    },
    {
      label: 'لوحة المهام',
      click: () => showAndFocusWindow('/dashboard'),
    },
    {
      label: 'مهامي الشخصية',
      click: () => showAndFocusWindow('/tasks'),
    },
    { type: 'separator' },
    {
      label: 'تشغيل تلقائي مع النظام',
      type: 'checkbox',
      checked: Boolean(loginSettings.openAtLogin),
      click: (menuItem) => {
        app.setLoginItemSettings({ openAtLogin: menuItem.checked });
        refreshTrayMenu();
      },
    },
    { type: 'separator' },
    {
      label: 'إغلاق نهائي',
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);
}

function createTray() {
  const icon = nativeImage.createFromPath(getIconPath(false)).resize({ width: 24, height: 24 });
  tray = new Tray(icon);
  tray.setToolTip('TaskSaaS — نظام إدارة المهام');
  refreshTrayMenu();
  tray.on('click', () => showAndFocusWindow());
}

function registerIpcHandlers() {
  ipcMain.handle('get-app-version', () => app.getVersion());

  ipcMain.handle('get-auto-launch', () => Boolean(app.getLoginItemSettings().openAtLogin));

  ipcMain.handle('set-auto-launch', (_event, enabled) => {
    app.setLoginItemSettings({ openAtLogin: Boolean(enabled) });
    refreshTrayMenu();
    return Boolean(app.getLoginItemSettings().openAtLogin);
  });

  ipcMain.handle('show-notification', (_event, { title, body, route } = {}) => {
    if (!Notification.isSupported()) return false;
    const notification = new Notification({
      title: title || 'TaskSaaS',
      body: body || '',
      icon: getIconPath(false),
    });
    notification.on('click', () => {
      showAndFocusWindow(route || '/dashboard');
    });
    notification.show();
    return true;
  });
}

function registerShortcuts() {
  globalShortcut.register('CommandOrControl+Shift+N', () => {
    showAndFocusWindow('/tasks');
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('quick-action', 'new-task');
    }
  });
}

function initAutoUpdater() {
  if (!app.isPackaged) return;
  try {
    const { autoUpdater } = require('electron-updater');
    autoUpdater.checkForUpdatesAndNotify().catch(() => {});
  } catch {
    // Ignore updater initialization errors in unpackaged or offline builds
  }
}

const gotSingleInstanceLock = IS_SMOKE_TEST ? true : app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
  app.quit();
} else {
  if (!IS_SMOKE_TEST) {
    app.on('second-instance', () => {
      showAndFocusWindow();
    });
  }

  app.whenReady().then(() => {
    if (process.platform === 'win32') {
      app.setAppUserModelId('com.tasksaas.desktop');
    }
    registerIpcHandlers();
    createMainWindow();
    createTray();
    registerShortcuts();
    initAutoUpdater();

    if (IS_SMOKE_TEST) {
      const ok = Boolean(mainWindow && tray && ipcMain);
      console.log(`ELECTRON_SMOKE_OK window=${Boolean(mainWindow)} tray=${Boolean(tray)} ok=${ok}`);
      globalShortcut.unregisterAll();
      isQuitting = true;
      app.exit(ok ? 0 : 1);
      return;
    }

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
      } else {
        showAndFocusWindow();
      }
    });
  });

  app.on('before-quit', () => {
    isQuitting = true;
  });

  app.on('will-quit', () => {
    globalShortcut.unregisterAll();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin' && isQuitting) {
      app.quit();
    }
  });
}
