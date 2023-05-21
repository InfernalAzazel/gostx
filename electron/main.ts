const { app, BrowserWindow } = require('electron')
const path = require('path')
const NODE_ENV = process.env.NODE_ENV
let win

const createWindow = () => {
    win = new BrowserWindow({
        width: 600,
        height: 800,
        minWidth: 600,
        minHeight: 800,
        center: true,
        skipTaskbar: false,
        transparent: false,
        webPreferences: {
            contextIsolation: false,
            webSecurity: false,
        }
    })

    win.loadURL(
        NODE_ENV === 'development' ? 'http://localhost:5173/' : `file://${path.join(__dirname, '../dist/index.html')}`
    )

    // if (NODE_ENV === 'development') {
    //     win.webContents.openDevTools()
    // }
}

app.whenReady().then(() => {
    createWindow()
})

/**
 * @Description: 限制只能打开一个页面
 * @CreationDate 2023-05-20 14:35:52
 */
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (win) {
            if (win.isMinimized()) win.restore()
            win.focus()
        }
    })
}

app.on('window-all-closed', function () {
    if(process.platform !== 'darwin') app.quit()
})