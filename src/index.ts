import { app, BrowserWindow } from 'electron';
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

import { ipcMain, dialog } from 'electron'
import fs from 'fs/promises';
import { PathLike } from 'original-fs';

async function readFile(filePath: PathLike): Promise<string> {
    let res: string
    try {
        res = await fs.readFile(filePath, { encoding: 'utf-8' })
    } catch (error) {
        console.log(error)
    }
    return res
}

async function writeFile(filePath: PathLike, content: string) {
    try {
        await fs.writeFile(filePath, content)
    } catch (error) {
        console.log(error)
    }
}

async function fileSelect(): Promise<PathLike> {
    const { canceled, filePaths } = await dialog.showOpenDialog(
        { title: "Select a file, or create a new file", properties: ['openFile', 'promptToCreate'] }
    )
    if (canceled) {
        return
    } else {
        // check if file already exists
        let fileExists = false
        try {
            await fs.access(filePaths[0])
            fileExists = true
        } catch (error) {
            fileExists = false
        }

        // if not, create a new file
        if (!fileExists) {
            await writeFile(filePaths[0], "")
        }

        return filePaths[0] as PathLike
    }
}

app.on('ready', () => {
    ipcMain.handle('fileSelect', fileSelect)
    ipcMain.handle('readFile', (e, filePath: PathLike) => readFile(filePath))
    ipcMain.handle('writeFile', (e, filePath: PathLike, content: string) => writeFile(filePath, content))
})