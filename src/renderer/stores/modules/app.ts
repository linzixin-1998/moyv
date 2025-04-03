import { defineStore } from 'pinia'
import { IAppState } from '@/renderer/types/stores/app'

const defaultAppState: IAppState = {
  menuList: [],
  activityMenu: null
}

export const useAppStore = defineStore('app', {
  state: () =>
    ({
      ...defaultAppState
    }) as IAppState,
  getters: {},
  actions: {
    init() {
      Object.keys(defaultAppState).forEach((key) => {
        this[key] = defaultAppState[key]
      })
    },
    updateMenuList(menuList: any[]) {
      this.menuList = menuList
    },
    updateActivityMenu(activityMenu: any) {
      this.activityMenu = activityMenu
    }
  },
  persist: {
    storage: localStorage
  }
})
