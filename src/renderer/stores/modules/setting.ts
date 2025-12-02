import { defineStore } from 'pinia'
import { ISettingState } from '@/renderer/types/stores/setting'

const defaultSettingState: ISettingState = {
    general: {
        autoAdsorption: true,
        showWay: 'edge',
        theme: 'dark',
        alwaysOnTop: true,
        hideMenu: false
    },
    shortcutKey: {
        showWay: '',
        alwaysOnTop: '',
        hideMenu: ''
    },
    plugins: {
        oneko: false
    }
}

export const useSettingStore = defineStore('setting', {
    state: () =>
        ({
            ...defaultSettingState
        }) as ISettingState,
    getters: {},
    actions: {
        updateSetting(key: keyof ISettingState, value: any) {
            console.log('updateSetting', key, value)
            this[key] = { ...this[key], ...value }
        }
    },
    persist: {
        storage: localStorage
    }
})
