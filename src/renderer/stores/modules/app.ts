import { defineStore } from 'pinia'
import { IAppState } from '@/renderer/types/stores/app'

const defaultAppState: IAppState = {}

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
    }
  }
})
