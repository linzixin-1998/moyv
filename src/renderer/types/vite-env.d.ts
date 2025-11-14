import { electronAPI } from '@electron-toolkit/preload'


declare global {
  interface Window {
    electron: typeof electronAPI,
    api: any
  }

  interface Console {
    path: string
  }
}

export { }
