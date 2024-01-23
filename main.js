const { app, BrowserWindow, ipcMain, Menu, shell, remote, dialog, globalShortcut, clipboard, } = require('electron');

// 当前窗口
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    minWidth: 1280,
    minHeight: 860,
    // width:width,
    // height:height,
    show: false,
    icon: path.join(__dirname, './public/icons/icon-512x512.png'),
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      allowRunningInsecureContent: true,
      // preload: path.join(__dirname, './config/preload.js'),
      webviewTag: true
    },
  });
  
  globalShortcut.register('Ctrl+Shift+I', () => {
    mainWindow.webContents.openDevTools();
  });
  
  
  // 默认最大化
  mainWindow.maximize();
  mainWindow.show();
  
  // 加载应用----react 打包
  mainWindow.loadURL(path.join('file://', __dirname, 'dist/index.html'));
}

app.whenReady().then(() => {
  createWindow()
})
