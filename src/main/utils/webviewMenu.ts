import { WebContents, MenuItemConstructorOptions, shell, clipboard } from 'electron'
import electronContextMenu from 'electron-context-menu'

export function setupContextMenu(webContents: WebContents) {
  const isWebview = webContents.getType() === 'webview'

  electronContextMenu({
    window: webContents,
    labels: getMenuLabels(),
    prepend: (_defaultActions, _params, _browserWindow) => {
      return [
        ...getNavigationMenuItems(webContents, isWebview),
        ...getPageActionItems(webContents, isWebview),
        ...getZoomMenuItems(webContents)
      ]
    },
    showCopyLink: isWebview,
    showCopyImage: isWebview,
    showCopyImageAddress: isWebview,
    showLookUpSelection: isWebview,
    showCopyVideoAddress: isWebview,
    showInspectElement: isWebview,
    showLearnSpelling: isWebview,
    showSaveImageAs: isWebview,
    showSaveLinkAs: isWebview,
    showSaveVideoAs: isWebview,
    showServices: isWebview
  })
}

function getMenuLabels(): Record<string, string> {
  return {
    cut: '剪切',
    copy: '复制',
    paste: '粘贴',
    selectAll: '全选',
    saveImage: '保存图片',
    saveImageAs: '图片另存为…',
    saveVideo: '保存视频',
    saveVideoAs: '视频另存为…',
    copyLink: '复制链接',
    saveLinkAs: '链接另存为…',
    copyImage: '复制图片',
    copyImageAddress: '复制图片地址',
    copyVideoAddress: '复制视频地址'
  }
}

function getNavigationMenuItems(
  webContents: WebContents,
  isWebview: boolean
): MenuItemConstructorOptions[] {
  return [
    {
      label: '后退',
      visible: isWebview && webContents.navigationHistory?.canGoBack(),
      click: () => webContents.navigationHistory?.goBack()
    },
    {
      label: '前进',
      visible: isWebview && webContents.navigationHistory?.canGoForward(),
      click: () => webContents.navigationHistory?.goForward()
    },
    {
      label: '重新加载',
      visible: true,
      click: () => webContents.reload()
    }
  ]
}

function getPageActionItems(
  webContents: WebContents,
  isWebview: boolean
): MenuItemConstructorOptions[] {
  return [
    {
      label: '复制页面 URL',
      visible: isWebview,
      click: () => clipboard.writeText(webContents.getURL())
    },
    {
      label: '在默认浏览器中打开页面',
      visible: isWebview,
      click: () => shell.openExternal(webContents.getURL())
    }
  ]
}

function getZoomMenuItems(webContents: WebContents): MenuItemConstructorOptions[] {
  return [
    {
      label: '放大',
      visible: true,
      click: () => webContents.setZoomFactor(webContents.getZoomFactor() + 0.1)
    },
    {
      label: '缩小',
      visible: true,
      click: () => webContents.setZoomFactor(webContents.getZoomFactor() - 0.1)
    },
    {
      label: '重置缩放',
      visible: true,
      click: () => webContents.setZoomFactor(1)
    }
  ]
}
