export const IPC_CHANNELS = {
  APP_PING: 'app:ping',
  APP_LOG: 'app:log',
  APP_MESSAGE: 'app:message',
  WINDOW_MINIMIZE: 'window:minimize',
  WINDOW_MAXIMIZE: 'window:maximize',
  WINDOW_CLOSE: 'window:close'
} as const

export type IpcInvokeMap = {
  [IPC_CHANNELS.APP_PING]: {
    args: []
    result: string
  }
  [IPC_CHANNELS.WINDOW_MINIMIZE]: {
    args: []
    result: void
  }
  [IPC_CHANNELS.WINDOW_MAXIMIZE]: {
    args: []
    result: boolean
  }
  [IPC_CHANNELS.WINDOW_CLOSE]: {
    args: []
    result: void
  }
}

export type RendererToMainEventMap = {
  [IPC_CHANNELS.APP_LOG]: [message: string]
}

export type MainToRendererEventMap = {
  [IPC_CHANNELS.APP_MESSAGE]: [message: string]
}

export type IpcInvokeChannel = keyof IpcInvokeMap
export type RendererToMainEventChannel = keyof RendererToMainEventMap
export type MainToRendererEventChannel = keyof MainToRendererEventMap

export type IpcInvokeArgs<TChannel extends IpcInvokeChannel> = IpcInvokeMap[TChannel]['args']
export type IpcInvokeResult<TChannel extends IpcInvokeChannel> = IpcInvokeMap[TChannel]['result']
export type RendererToMainEventArgs<TChannel extends RendererToMainEventChannel> =
  RendererToMainEventMap[TChannel]
export type MainToRendererEventArgs<TChannel extends MainToRendererEventChannel> =
  MainToRendererEventMap[TChannel]

export interface AppIpcApi {
  invoke<TChannel extends IpcInvokeChannel>(
    channel: TChannel,
    ...args: IpcInvokeArgs<TChannel>
  ): Promise<IpcInvokeResult<TChannel>>
  send<TChannel extends RendererToMainEventChannel>(
    channel: TChannel,
    ...args: RendererToMainEventArgs<TChannel>
  ): void
  on<TChannel extends MainToRendererEventChannel>(
    channel: TChannel,
    listener: (...args: MainToRendererEventArgs<TChannel>) => void
  ): () => void
  once<TChannel extends MainToRendererEventChannel>(
    channel: TChannel,
    listener: (...args: MainToRendererEventArgs<TChannel>) => void
  ): () => void
  removeAllListeners<TChannel extends MainToRendererEventChannel>(channel: TChannel): void
}

export interface AppApi {
  ipc: AppIpcApi
}
