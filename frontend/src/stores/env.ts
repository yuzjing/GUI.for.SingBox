import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

import { GetEnv } from '@/bridge'
import { updateTrayMenus } from '@/utils'
import { useKernelApiStore } from '@/stores'
import { SetSystemProxy, GetSystemProxy } from '@/utils'
import { useAppSettingsStore } from './appSettings'

export const useEnvStore = defineStore('env', () => {
  const env = ref({
    appName: '',
    basePath: '',
    os: '',
    arch: '',
    x64Level: 0,
  })

  const systemProxy = ref(false)

  const setupEnv = async () => {
    const _env = await GetEnv()
    env.value = _env
  }

  const updateSystemProxyStatus = async () => {
    const kernelApiStore = useKernelApiStore()
    const proxyServer = await GetSystemProxy()

    if (!proxyServer) {
      systemProxy.value = false
    } else {
      const { port, 'mixed-port': mixedPort, 'socks-port': socksPort } = kernelApiStore.config
      const ipv6Enabled = useAppSettingsStore().app.ipv6SystemProxy
      const address = ipv6Enabled ? '[::1]' : '127.0.0.1'
      const proxyServerList = [
        `http://${address}:${port}`,
        `http://${address}:${mixedPort}`,

        `socks5://${address}:${mixedPort}`,
        `socks5://${address}:${socksPort}`,

        `socks=${address}:${mixedPort}`,
        `socks=${address}:${socksPort}`,
      ]
      systemProxy.value = proxyServerList.includes(proxyServer)
    }

    return systemProxy.value
  }

  const setSystemProxy = async () => {
    const proxyPort = useKernelApiStore().getProxyPort()
    if (!proxyPort) throw 'home.overview.needPort'

    // Support both IPv4 and IPv6 loopback addresses
    const ipv6Enabled = useAppSettingsStore().app.ipv6SystemProxy
    const address = ipv6Enabled ? '[::1]' : '127.0.0.1'
    await SetSystemProxy(true, `${address}:${proxyPort.port}`, proxyPort.proxyType)

    systemProxy.value = true
  }

  const clearSystemProxy = async () => {
    await SetSystemProxy(false, '')
    systemProxy.value = false
  }

  const switchSystemProxy = async (enable: boolean) => {
    if (enable) await setSystemProxy()
    else await clearSystemProxy()
  }

  watch(systemProxy, updateTrayMenus)

  return {
    env,
    setupEnv,
    systemProxy,
    setSystemProxy,
    clearSystemProxy,
    switchSystemProxy,
    updateSystemProxyStatus,
  }
})
