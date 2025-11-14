import { BrowserWindow } from 'electron'
export const message = (window: BrowserWindow, option: { type: 'info' | 'success' | 'warning' | 'error' | 'loading' | 'default', message: string }) => {
    let js = `(()=>{window.$message["${option.type}"]("${option.message}")})()`
    window.webContents.executeJavaScript(js)
}