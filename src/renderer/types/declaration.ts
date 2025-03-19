/// <reference types="vite/client" />

/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
}

// declaration.d.ts
declare module '*.scss' {
  const content: Record<string, string>
  export default content
}

declare type TargetContext = '_self' | '_blank'

declare module '*.css'
declare module '*.less'
declare module '*.sass'
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.js'
