import { defineStore } from 'pinia'
import { IAppState, IMenuItem } from '@/renderer/types/stores/app'

const defaultAppState: IAppState = {
  menuList: [],
  activityMenu: null,
  history: {}
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
    updateMenuList(menuList: IMenuItem[]) {
      this.menuList = menuList
    },
    updateActivityMenu(activityMenu: IMenuItem) {
      this.activityMenu = activityMenu
    },
    removeMenu(menuItem: IMenuItem) {
      if (menuItem.name === this.activityMenu?.name) {
        this.activityMenu = null
      }
      this.history[menuItem.name] = undefined
      this.menuList = this.menuList.filter((item) => item.name !== menuItem.name)
    },
    updateHistory(key: string, value: any) {
      this.history[key] = value
    }
  },
  persist: {
    storage: localStorage
  }
})
