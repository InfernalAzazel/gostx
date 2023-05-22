import { app, BrowserWindow, ipcMain } from 'electron'
import {spawn} from "child_process";
import * as path from "path";
import * as fs from 'fs';

app.whenReady().then(() => {
    let childPID = 0
    const win = new BrowserWindow({
        title: 'gostX',
        width: 1000,
        height: 800,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
        }
    })
    const userDataPath = app.getPath('userData');
    const filePath = path.join(userDataPath, 'proxy.yaml');
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            fs.writeFile(filePath, 'proxy:', (err) => {
                if (err) {
                    console.error('Error creating file:', err);
                } else {
                    console.log('File created');
                }
            });
        } else {
            // The file exists
            console.log('File exists');
        }
    });

    if(process.env.NODE_ENV === 'production'){
        win.setMenuBarVisibility(false)
    }

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
        event.reply('get-command-pid', childPID)
    })
    ipcMain.on('command-kill', (event, args) => {
        process.kill(childPID)
    })
    ipcMain.on('read-proxy', (event, args) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err)
            } else {
                event.reply('read-proxy', data)
            }
        })
    })
    ipcMain.on('write-proxy', (event, args) => {
        fs.writeFile(filePath, args, 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log('File written successfully');
            }
        });
    })
})
