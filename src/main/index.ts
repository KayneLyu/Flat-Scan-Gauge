import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let mainWindow: BrowserWindow
let splashWindow: BrowserWindow

// 加载动画
function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, // 无边框，更像启动画面
    transparent: true, // 可选：透明背景，让设计更灵活
    alwaysOnTop: true, // 置于顶层，不被其他窗口遮挡
    skipTaskbar: true, // 不显示在任务栏（可选）
    resizable: false,
    webPreferences: {
      // 安全配置
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true // splash 不需要 Node API，直接开沙箱
    }
  })

  // 根据环境选择加载方式
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    // 开发环境：从 dev server 加载（Vite 会 serve public 下的文件）
    splashWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/splash.html`)
  } else {
    // 生产环境：从 out/ 目录加载（public 被复制到 out/ 根目录）
    // __dirname 为 out/main，所以 ../ 即为 out/
    splashWindow.loadFile(join(__dirname, '../renderer/splash.html'))
  }
}

// 主窗口
function createMainWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    },
  })

  mainWindow.on('ready-to-show', () => {
    // 立即关闭闪窗
    // if (splashWindow && !splashWindow.isDestroyed()) {
    //   splashWindow.destroy() // splashWindow.close()
    // }

    // 显示动画时间
    setTimeout(() => {
      if (splashWindow && !splashWindow.isDestroyed()) {
        splashWindow.destroy()
      }
      mainWindow.show()
    }, 3000)
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // 如果主窗口加载失败，也关闭闪窗（防止卡死）
  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.destroy()
    }
    dialog.showErrorBox('启动失败', `应用加载失败: ${errorDescription}`)
  })
}

// 防止重复点击软件
const getLock = app.requestSingleInstanceLock()
if (!getLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  createSplashWindow()
  createMainWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
