import { app, BrowserWindow, ipcMain, dialog, clipboard, Notification } from 'electron'
import {spawn} from "child_process";
import * as path from "path";
import * as fs from 'fs';

const showNotification = () => {
    const notification = {
        title: '通知',
        body: '操作成功'
    }
    new Notification(notification).show()
}
app.whenReady().then(() => {
    let childPID = 0
    let shName = 'gost'
    const platform = process.platform;
    if (platform === 'darwin') {
        console.log('Running on macOS');
    } else if (platform === 'win32') {
        shName = 'gost.exe'
        console.log('Running on Windows');
    } else if (platform === 'linux') {
        shName = 'gost'
        console.log('Running on Linux');
    } else {
        console.log('Unknown platform');
    }
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
    console.log(filePath)
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
            console.log('File exists');
        }
    });
    console.log(process.env.NODE_ENV);
    if(process.env.NODE_ENV !== 'development'){
        win.setMenuBarVisibility(false)
    }

    // You can use `process.env.VITE_DEV_SERVER_URL` when the vite command is called `serve`
    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL)
    } else {
        // Load your file
        win.loadFile('dist/index.html');
    }

    ipcMain.on('run-command', (event, args) => {
        const command = path.join(userDataPath, shName)
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

    ipcMain.on('open-file-dialog', async (event) => {
        const result = await dialog.showOpenDialog({
            properties: ['openFile']
        });

        if (result.filePaths.length > 0) {
            const targetFile = path.join(userDataPath, shName);
            const filePath  = result.filePaths[0];
            fs.copyFile(filePath, targetFile, (err) => {
                if (err) {
                    console.log('Error occurred while copying file: ', err);
                } else {
                    console.log('File copied successfully.');
                }
            });
            return filePath;
        } else {
            return null;
        }
    });
    ipcMain.on('on-clipboard', (event, args) => {
        clipboard.writeText(args.toString())
        console.log('clipboard successfully')
        showNotification()
    })
})
