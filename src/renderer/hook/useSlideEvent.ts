import { ref } from 'vue'
import { SLIDE_CHANNEL } from '@/common/electronChannel'

type EdgeType = 'left' | 'right'
export const useElectronUpdate = () => {
  const edge = ref<EdgeType>('right')
  window.electron.ipcRenderer.on(SLIDE_CHANNEL.SNAP_TO_EDGE, (_: any, data: EdgeType) => {
    edge.value = data
  })
  return {
    edge
  }
}
