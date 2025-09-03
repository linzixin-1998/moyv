// electron ipc channel
export enum IPC_CHANNEL {
  OPEN_WIN = 'open-win'
}

// electron update channel
export enum UPDATE_CHANNEL {
  CHECK_UPDATE = 'check-update',
  UPDATE_INFO = 'update-info',
  UPDATE_PROGRESS = 'update-progress',
  UPDATE_ERROR = 'update-error',
  UPDATE_DOWNLOADED = 'update-downloaded',
  UPDATE_SETUP = 'update-setup',
  UPDATE_NEWEST = 'update-newest',
  UPDATE_DOWNLOAD = 'update-download',
  UPDATE_INCREMENTAL_DOWNLOAD = 'incremental-update-download',
  UPDATE_ZIP_INCREMENTAL_SUCCESS = 'update-zip-incremental-success',
  UPDATE_ASAR_INCREMENTAL_DOWNLOADED = 'update-asar-incremental-downloaded'
}

export enum SLIDE_CHANNEL {
  SNAP_TO_EDGE = 'snap-to-edge',
  SHOW_WINDOW = 'show-window'
}

export enum EVENT_CHANNEL {
  UPDATE_CONFIG = 'update-config'
}
