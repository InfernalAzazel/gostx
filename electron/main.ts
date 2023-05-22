import { app, BrowserWindow, ipcMain } from 'electron'
import {spawn} from "child_process";

app.whenReady().then(() => {
    let childPID = 0
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

    ipcMain.on('run-command', (event, command, args) => {
        const child = spawn(command, args)
        childPID = child.pid
        child.stdout.on('data', (data) => {
            event.reply('command-output', data.toString())
        })

        child.stderr.on('data', (data) => {
            event.reply('command-error', data.toString())
        })

        child.on('close', (code) => {
            childPID = 0
            event.reply('command-close', code)
        })
    })
    ipcMain.on('get-command-pid', (event, args) => {
        event.reply('command-close', childPID)
    })
    ipcMain.on('command-kill', (event, args) => {
        process.kill(childPID)
    })
})
