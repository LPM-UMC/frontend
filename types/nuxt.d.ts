import type { AxiosInstance } from 'axios'

declare module '#app' {
  interface NuxtApp {
    $axios: AxiosInstance
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
  }
}

export { }

