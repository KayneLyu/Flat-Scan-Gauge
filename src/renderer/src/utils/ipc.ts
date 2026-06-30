import type {
  IpcInvokeArgs,
  IpcInvokeChannel,
  IpcInvokeResult,
  MainToRendererEventArgs,
  MainToRendererEventChannel,
  RendererToMainEventArgs,
  RendererToMainEventChannel
} from '../../../shared/ipc'

export { IPC_CHANNELS } from '../../../shared/ipc'

export function invoke<TChannel extends IpcInvokeChannel>(
  channel: TChannel,
  ...args: IpcInvokeArgs<TChannel>
): Promise<IpcInvokeResult<TChannel>> {
  return window.api.ipc.invoke(channel, ...args)
}

export function send<TChannel extends RendererToMainEventChannel>(
  channel: TChannel,
  ...args: RendererToMainEventArgs<TChannel>
): void {
  window.api.ipc.send(channel, ...args)
}

export function on<TChannel extends MainToRendererEventChannel>(
  channel: TChannel,
  listener: (...args: MainToRendererEventArgs<TChannel>) => void
): () => void {
  return window.api.ipc.on(channel, listener)
}

export function once<TChannel extends MainToRendererEventChannel>(
  channel: TChannel,
  listener: (...args: MainToRendererEventArgs<TChannel>) => void
): () => void {
  return window.api.ipc.once(channel, listener)
}

export function removeAllListeners<TChannel extends MainToRendererEventChannel>(
  channel: TChannel
): void {
  window.api.ipc.removeAllListeners(channel)
}
