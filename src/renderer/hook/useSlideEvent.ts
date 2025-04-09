import { ref } from 'vue'
import { SLIDE_CHANNEL } from '@/common/electronChannel'

type EdgeType = 'left' | 'right'
export const useSlideEvent = () => {
  const edge = ref<EdgeType>('right')
  const inAnimation = ref(false)
  window.electron.ipcRenderer.on(SLIDE_CHANNEL.SNAP_TO_EDGE, (_: any, data: EdgeType) => {
    edge.value = data
  })
  window.electron.ipcRenderer.on(SLIDE_CHANNEL.SHOW_WINDOW, (_: any, { duration }) => {
    inAnimation.value = true
    setTimeout(() => {
      inAnimation.value = false
    }, duration * 2.5)
  })
  return {
    edge,
    inAnimation
  }
}
