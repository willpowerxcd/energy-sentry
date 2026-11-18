import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    headerTitle?: string
    icon?: string
    hidden?: boolean
    public?: boolean
    roles?: string[]
    devOnly?: boolean
    description?: string
  }
}

export {}
