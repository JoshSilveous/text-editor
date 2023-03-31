// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
    fileSelect: () => ipcRenderer.invoke('fileSelect'),
    readFile: (filePath) => ipcRenderer.invoke('readFile', filePath),
    writeFile: (filePath, content) => ipcRenderer.invoke('writeFile', filePath, content)
} as Window['api'])