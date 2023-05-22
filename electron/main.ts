import { app, BrowserWindow, ipcMain } from 'electron'
import {spawn} from "child_process";

app.whenReady().then(() => {
    const win = new BrowserWindow({
        title: 'Main window',
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
        }
    })

    // You can use `process.env.VITE_DEV_SERVER_URL` when the vite command is called `serve`
    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL)
    } else {
        // Load your file
        win.loadFile('dist/index.html');
    }
    // 主进程接收渲染进程传递信息
    ipcMain.on('msg', (_, num) => {
        console.log('渲染进程传递信息 :>> ', num);
    })
    ipcMain.on('run-command', (event, command, args) => {
        const child = spawn(command, args)

        child.stdout.on('data', (data) => {
            event.reply('command-output', data.toString())
        })

        child.stderr.on('data', (data) => {
            event.reply('command-error', data.toString())
        })

        child.on('close', (code) => {
            event.reply('command-close', code)
        })
    })
    setTimeout(() => {
        // 主进程传递渲染进程
        win.webContents.send('load', { msg: '初始化完成' })
    }, 2000);
})
