import { BrowserWindow, ipcMain, type IpcMainEvent, type IpcMainInvokeEvent } from 'electron'
import {
  IPC_CHANNELS,
  type IpcInvokeArgs,
  type IpcInvokeChannel,
  type IpcInvokeResult,
  type MainToRendererEventArgs,
  type MainToRendererEventChannel,
  type RendererToMainEventArgs,
  type RendererToMainEventChannel
} from '../shared/ipc'

type InvokeHandler<TChannel extends IpcInvokeChannel> = (
  event: IpcMainInvokeEvent,
  ...args: IpcInvokeArgs<TChannel>
) => IpcInvokeResult<TChannel> | Promise<IpcInvokeResult<TChannel>>

type OnListener<TChannel extends RendererToMainEventChannel> = (
  event: IpcMainEvent,
  ...args: RendererToMainEventArgs<TChannel>
) => void

export function handle<TChannel extends IpcInvokeChannel>(
  channel: TChannel,
  handler: InvokeHandler<TChannel>
): () => void {
  ipcMain.handle(channel, handler as (...args: unknown[]) => unknown)

  return () => {
    ipcMain.removeHandler(channel)
  }
}

export function on<TChannel extends RendererToMainEventChannel>(
  channel: TChannel,
  listener: OnListener<TChannel>
): () => void {
  const wrappedListener = listener as (...args: unknown[]) => void

  ipcMain.on(channel, wrappedListener)

  return () => {
    ipcMain.off(channel, wrappedListener)
  }
}

export function sendToRenderer<TChannel extends MainToRendererEventChannel>(
  window: BrowserWindow | undefined,
  channel: TChannel,
  ...args: MainToRendererEventArgs<TChannel>
): void {
  if (!window || window.isDestroyed()) return

  window.webContents.send(channel, ...args)
}

export function registerIpcHandlers(getMainWindow: () => BrowserWindow | undefined): () => void {
  const disposers = [
    handle(IPC_CHANNELS.APP_PING, () => 'pong'),
    handle(IPC_CHANNELS.WINDOW_MINIMIZE, () => {
      getMainWindow()?.minimize()
    }),
    handle(IPC_CHANNELS.WINDOW_MAXIMIZE, () => {
      const window = getMainWindow()
      if (!window) return false

      if (window.isMaximized()) {
        window.unmaximize()
        return false
      }

      window.maximize()
      return true
    }),
    handle(IPC_CHANNELS.WINDOW_CLOSE, () => {
      getMainWindow()?.close()
    }),
    on(IPC_CHANNELS.APP_LOG, (_event, message) => {
      console.log(message)
    })
  ]

  return () => {
    disposers.forEach((dispose) => dispose())
  }
}
