import { ShortcutKeyName } from "@/common/types"
/**
 * 设置
 */
export interface ISettingState {
    general: IGeneralSetting
    shortcutKey: {
        [K in ShortcutKeyName]?: string; // 可选值
    }
}

// 通用设置
export interface IGeneralSetting {
    theme: 'light' | 'dark'
    autoAdsorption: boolean
    showWay: 'edge' | 'shortcutKey',
    alwaysOnTop: boolean
    hideMenu: boolean
}



