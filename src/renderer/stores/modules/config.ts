import { defineStore } from 'pinia'
import { IConfigState } from '@/renderer/types/stores/config'

const defaultConfigState: IConfigState = {
  accessToken: ''
}

export const useConfigStore = defineStore('config', {
  state: () => ({ ...defaultConfigState }) as IConfigState,
  getters: {},
  actions: {
    init() {
      Object.keys(defaultConfigState).forEach((key) => {
        this[key] = defaultConfigState[key]
      })
    },
    updateAccessToken(accessToken: string) {
      this.accessToken = accessToken
    }
  },
  persist: {
    storage: localStorage,
    pick: ['accessToken']
  }
})
