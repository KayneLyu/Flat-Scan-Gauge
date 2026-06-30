import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { AppApi, MainToRendererEventArgs, MainToRendererEventChannel } from '../shared/ipc'

// Custom APIs for renderer
const api: AppApi = {
  ipc: {
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
    send: (channel, ...args) => {
      ipcRenderer.send(channel, ...args)
    },
    on: (channel, listener) => {
      const subscription = createSubscription(channel, listener)

      ipcRenderer.on(channel, subscription)

      return () => {
        ipcRenderer.removeListener(channel, subscription)
      }
    },
    once: (channel, listener) => {
      const subscription = createSubscription(channel, listener)

      ipcRenderer.once(channel, subscription)

      return () => {
        ipcRenderer.removeListener(channel, subscription)
      }
    },
    removeAllListeners: (channel) => {
      ipcRenderer.removeAllListeners(channel)
    }
  }
}

function createSubscription<TChannel extends MainToRendererEventChannel>(
  _channel: TChannel,
  listener: (...args: MainToRendererEventArgs<TChannel>) => void
): (event: IpcRendererEvent, ...args: unknown[]) => void {
  return (_event, ...args) => {
    listener(...(args as MainToRendererEventArgs<TChannel>))
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

