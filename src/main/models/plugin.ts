import { windowManager } from '../window/windowManager'
import appConfig from '../config'
export interface IPlugins {
    oneko: boolean
}

export const pluginHandler: {
    [K in keyof IPlugins]?: (newValue: boolean, oldValue: boolean) => boolean;
} = {
    oneko(newValue: boolean, oldValue?: boolean) {
        console.log('oneko:', newValue);
        const invisibleWindow = windowManager.invisibleWindow;
        if (!invisibleWindow) return false;
        if (newValue) {
            invisibleWindow.showWindow()
        } else {
            invisibleWindow.hideWindow()
        }
        return true
    }
}


export const initPlugins = () => {
    Object.keys(appConfig.plugins).forEach((key) => {
        pluginHandler[key]?.(appConfig.plugins[key])
    })
}
