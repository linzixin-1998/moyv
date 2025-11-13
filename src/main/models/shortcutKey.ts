import { ShortcutKeyName } from "@/common/types"

import { windowManager } from '../window/windowManager'
import { globalShortcut } from 'electron'
import appConfig from '../config'

export type IShortcutKeyConfig = Record<ShortcutKeyName, string>;
export type IShortcutKeyUpdateReuslt = {
    [K in ShortcutKeyName]?: boolean;
};
export const shortcutKeyHandler: {
    [K in ShortcutKeyName]?: (shortcutKeyString: string, oldShortcutKeyString: string) => boolean;
} = {
    showWay(shortcutKeyString: string, oldShortcutKeyString?: string) {
        console.log('register shortcut key:', shortcutKeyString);
        const updateReuslt = globalShortcut.register(shortcutKeyString, () => {
            if (appConfig.showWay === 'shortcutKey') {
                windowManager.mainWindow?.showWindow()
            }
        })
        oldShortcutKeyString && globalShortcut.unregister(oldShortcutKeyString)
        console.log('shortcut key register result:', updateReuslt);
        return updateReuslt
    },
    alwaysOnTop(shortcutKeyString: string, oldShortcutKeyString?: string) {
        console.log('register shortcut key:', shortcutKeyString);
        const updateReuslt = globalShortcut.register(shortcutKeyString, () => {
            if (!appConfig.alwaysOnTop) return
            if (!windowManager.mainWindow?.window.isVisible()) return
            console.log('alwaysOnTop');
            let isAlwaysOnTop = windowManager.mainWindow?.window.isAlwaysOnTop()

            windowManager.mainWindow?.window.setAlwaysOnTop(!isAlwaysOnTop)
            if (isAlwaysOnTop) {
                windowManager.mainWindow?.window.focus()
                windowManager.mainWindow?.window.blur()
            }
        })
        oldShortcutKeyString && globalShortcut.unregister(oldShortcutKeyString)
        console.log('shortcut key register result:', updateReuslt);
        return updateReuslt
    }
}

export const initShortcutKeys = () => {
    Object.keys(appConfig.shortcutKey).forEach((key) => {
        shortcutKeyHandler[key]?.(appConfig.shortcutKey[key])
    })
}

