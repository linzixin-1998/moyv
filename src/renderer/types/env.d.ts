/// <reference types="vite/client" />

declare interface Window {
    $message: ReturnType<typeof useMessage>
}
