/**
 * 设置
 */
export interface ISettingState {
    general: IGeneralSetting
}

// 通用设置
export interface IGeneralSetting {
    theme: 'light' | 'dark'
    autoAdsorption: boolean
    hideWay: 'edge' | 'shortcutKey'
}

