import { BaseWindow, IBaseWindowOptions } from './baseWindow'
import { screen, globalShortcut } from 'electron'
import { sleep } from '../utils/baseUtils'
import robot from 'robotjs'
import { SLIDE_CHANNEL } from '../../common/electronChannel'
import electronContextMenu from 'electron-context-menu'

import appConfig from '../config'

export class SlideWindow extends BaseWindow {
  private snapState = {
    isSnapping: false,
    lastSnappedEdge: null as 'left' | 'right' | 'top' | null,
    originalSize: null as { width: number; height: number } | null,
    isDragging: false,
    snapPosition: [] as number[]
  }

  // 自动贴边的距离边缘的边距
  private MARGIN = 10

  // 滑动动画的时长
  private ANIMATE_DURATION = 300

  // 窗口是否正在移动
  private isMoving = false

  // 窗口是否隐藏
  private isVisible = true

  // 鼠标移动检测
  private mouseCheckInterval: NodeJS.Timeout | null = null

  // 最后保存的窗口位置
  private lastPosition: number[] = []

  constructor(option: IBaseWindowOptions) {
    super(option)
    this.registerEvents()
    this.initContextMenu()
  }

  // 注册事件
  registerEvents() {
    this.startMousePositionCheck()
    this.window
      .on('will-move', () => {
        this.isMoving = true
        this.isVisible = true
      })
      .on('moved', () => {
        this.isMoving = false
        if (appConfig.autoAdsorption) {
          this.snapToEdge()
        }
      })
      .on('blur', async () => {
        if (!this.window || !this.isVisible) return
        await this.snapToEdge()
        await this.hideWindow()
      })
    globalShortcut.register('F2', () => {
      if (appConfig.hideWay === 'shortcutKey') {
        this.showWindow()
      }
    })
  }

  detectDisplay() {
    const displays = screen.getAllDisplays() // 获取所有显示器信息
    const bounds = this.window.getBounds() // 获取传入元素的边界

    // 查找与 bounds 匹配的显示器，如果找不到则尝试其他方案
    const matchedDisplay = getPos(bounds, displays)
    return matchedDisplay || getOtherMatchedDisplay(bounds, displays)
  }

  focus() {
    const n = robot.getMousePos()
    robot.moveMouseSmooth(
      this.snapState.lastSnappedEdge === 'left' ? n.x + this.MARGIN * 2 : n.x - this.MARGIN * 2,
      n.y
    )
    robot.mouseClick()
  }

  private startMousePositionCheck() {
    if (this.mouseCheckInterval) {
      clearInterval(this.mouseCheckInterval)
    }

    this.mouseCheckInterval = setInterval(async () => {
      if (this.isVisible || !this.window) return
      if (appConfig.hideWay === 'shortcutKey') return
      const hideX = this.lastPosition[0]
      const hideY = this.lastPosition[1]
      const { width: winWidth, height: winHeight } = this.window.getBounds()
      const mousePos = robot.getMousePos()

      if (mousePos.y < hideY || mousePos.y > hideY + winHeight) return

      if (this.snapState.lastSnappedEdge === 'left') {
        if (Math.abs(mousePos.x - hideX) <= this.MARGIN) {
          await this.showWindow()
          await sleep(this.ANIMATE_DURATION)
          this.focus()
        }
        return
      } else if (this.snapState.lastSnappedEdge === 'right') {
        const mosx = hideX + winWidth
        if (Math.abs(mousePos.x - mosx) <= this.MARGIN) {
          await this.showWindow()
          await sleep(this.ANIMATE_DURATION)
          this.focus()
        }
      }
    }, 100)
  }

  private async snapToEdge() {
    if (!this.window || this.window.isDestroyed() || this.isMoving) return

    const display = getDisplay(this.window)

    const n = display.bounds.width,
      r = this.window.getBounds()

    const edge = r.x - display.workArea.x + r.width / 2 < n / 2 ? 'left' : 'right'

    this.snapState.lastSnappedEdge = edge

    const targetPosition = this.calculateSnapPosition({
      window: this.window,
      display: display,
      edge: edge
    })

    const { width: winWidth, height: winHeight } = this.window.getBounds()
    const { width: displayWidth, height: displayHeight } = display.workArea

    // Ensure window size fits within display bounds
    if (winWidth > displayWidth || winHeight > displayHeight) {
      this.window.setSize(
        Math.ceil(Math.min(winWidth, displayWidth * 0.95)),
        Math.ceil(Math.min(winHeight, displayHeight * 0.95))
      )
    }

    const [currentX, currentY] = this.window.getPosition()
    if (currentX !== targetPosition.x || currentY !== targetPosition.y) {
      this.snapState.snapPosition = [targetPosition.x, targetPosition.y]
      this.animateWindowMovement({
        window: this.window,
        targetX: targetPosition.x,
        targetY: targetPosition.y,
        windowWidth: winWidth,
        windowHeight: winHeight
      })
      await sleep(this.ANIMATE_DURATION)
      this.isMoving = false
      this.snapState.isSnapping = true
      this.window.webContents.send(SLIDE_CHANNEL.SNAP_TO_EDGE, edge)
    }
  }

  async hideWindow() {
    if (!this.window || this.window.isDestroyed() || !this.isVisible || !this.snapState.isSnapping)
      return
    this.lastPosition = this.window.getPosition()

    const { width: winWidth, height: winHeight } = this.window.getBounds()
    const [currentX, currentY] = this.window.getPosition()
    let x = 0
    if (this.snapState.lastSnappedEdge === 'left') {
      x = currentX - winWidth - this.MARGIN
    } else if (this.snapState.lastSnappedEdge === 'right') {
      x = currentX + winWidth + this.MARGIN
    }

    await this.animateWindowMovement({
      window: this.window,
      targetX: x,
      targetY: currentY,
      windowWidth: winWidth,
      windowHeight: winHeight
    })
    this.window.setAlwaysOnTop(false)
    await sleep(this.ANIMATE_DURATION)
    this.window.hide()
    this.isVisible = false
  }

  async showWindow() {
    if (!this.window || this.window.isDestroyed()) return

    this.isVisible = true
    const { width: winWidth, height: winHeight } = this.window.getBounds()

    this.window.webContents.send(SLIDE_CHANNEL.SHOW_WINDOW, { duration: this.ANIMATE_DURATION })

    setTimeout(() => {
      this.window.setAlwaysOnTop(true)
    }, 150)
    await this.animateWindowMovement({
      window: this.window,
      targetX: this.lastPosition[0],
      targetY: this.lastPosition[1],
      windowWidth: winWidth,
      windowHeight: winHeight
    })
    this.window.show()
  }

  /** 窗口移动动画 */
  animateWindowMovement({
    window,
    targetX,
    targetY,
    windowWidth,
    windowHeight,
    duration = this.ANIMATE_DURATION
  }) {
    const [startX, startY] = window.getPosition()
    const startTime = Date.now()
    const step = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      const currentX = startX + (targetX - startX) * progress
      const currentY = startY + (targetY - startY) * progress
      this.moveWindow({
        window,
        x: currentX,
        y: currentY,
        width: windowWidth,
        height: windowHeight
      })
      if (progress < 1) {
        setTimeout(step, 1)
      } else {
        this.snapState.isSnapping = true
      }
    }

    step()
  }

  /** 更改窗口位置 */
  moveWindow(e) {
    try {
      const { x: t, y: n, window: r, width: i, height: s, animate: o } = e
      r.setBounds(
        {
          x: Math.round(t),
          y: Math.round(n),
          width: i,
          height: s
        },
        o
      )
    } catch (e) {
      console.log(e)
    }
  }

  calculateSnapPosition({ window, display, edge = 'right', isVisible = true }) {
    const [windowWidth] = window.getSize()
    const {
      workArea: { y: workY, height: workHeight },
      bounds
    } = display

    const windowHeightFraction = workHeight / 1
    let targetY = workY + (1 + 0.5) * windowHeightFraction
    let targetX

    if (isVisible) {
      // 修改这里的逻辑，确保窗口在显示器可见区域内
      targetX =
        edge === 'right'
          ? bounds.x + bounds.width - windowWidth - this.MARGIN // 使用 bounds 而不是 workArea
          : bounds.x + this.MARGIN
    } else {
      targetX =
        edge === 'right'
          ? bounds.x + bounds.width + this.MARGIN // 完全隐藏到右边
          : bounds.x - windowWidth - this.MARGIN // 完全隐藏到左边

      const { position, height } = getEdgePosition(display)
      if (edge === position) {
        targetX += position === 'left' ? height + 5 : -height - 5
      }
    }

    targetY = window.getPosition()[1]

    return { x: targetX, y: targetY }
  }

  initContextMenu() {
    electronContextMenu({
      window: this.window
    })
  }
}

function getOverlapArea(rectA, rectB) {
  // 计算 X 轴方向的重叠宽度
  const overlapWidth = Math.max(
    0,
    Math.min(rectA.x + rectA.width, rectB.x + rectB.width) - Math.max(rectA.x, rectB.x)
  )

  // 计算 Y 轴方向的重叠高度
  const overlapHeight = Math.max(
    0,
    Math.min(rectA.y + rectA.height, rectB.y + rectB.height) - Math.max(rectA.y, rectB.y)
  )

  // 返回重叠区域的面积
  return overlapWidth * overlapHeight
}

function getOtherMatchedDisplay(e, t) {
  return t.reduce(
    (bestMatch, display) => {
      const overlapArea = getOverlapArea(e, display.bounds)
      return overlapArea > bestMatch.maxOverlap ? { maxOverlap: overlapArea, display } : bestMatch
    },
    { maxOverlap: 0, display: t[0] }
  ).display
}

function getPos(e, t) {
  // 计算中心点坐标
  const centerX = e.x + e.width / 2
  const centerY = e.y + e.height / 2

  // 在显示器列表中查找匹配的显示器
  return t.find(({ bounds }) => {
    const { x, y, width, height } = bounds

    // 检查中心点是否在显示器的范围内
    return centerX >= x && centerX <= x + width && centerY >= y && centerY <= y + height
  })
}

function getDisplay(e) {
  const displays = screen.getAllDisplays() // 获取所有显示器信息
  const bounds = e.getBounds() // 获取传入元素的边界

  // 查找与 bounds 匹配的显示器，如果找不到则尝试其他方案
  const matchedDisplay = getPos(bounds, displays)
  return matchedDisplay || getOtherMatchedDisplay(bounds, displays)
}

function getWorkAreaY(display) {
  return display.workArea.y
}

function getScreenEdge(display) {
  const { width: screenWidth } = display.bounds
  const { x: workAreaX, width: workAreaWidth } = display.workArea

  if (workAreaWidth < screenWidth) {
    return workAreaX > 0 ? 'left' : 'right'
  }
  return 'bottom'
}

function getEdgePosition(display) {
  const primaryDisplay = screen.getPrimaryDisplay()
  if (display.id !== primaryDisplay.id) {
    return { position: 'bottom', height: 0 }
  }

  const edge = getScreenEdge(display)
  const { height: screenHeight, width: screenWidth } = display.bounds
  const { height: workAreaHeight, width: workAreaWidth } = display.workAreaSize

  if (edge === 'left' || edge === 'right') {
    return { position: edge, height: screenWidth - workAreaWidth }
  }
  return { position: 'bottom', height: screenHeight - workAreaHeight - getWorkAreaY(display) }
}
