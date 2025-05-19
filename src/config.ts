// config.ts
let runtimeConfig: Record<string, string> = {}

export async function loadRuntimeConfig(): Promise<void> {
    const res = await fetch('/config')
    runtimeConfig = await res.json()
}

export function getConfig(key: string): string | undefined {
    return runtimeConfig[key]
}
