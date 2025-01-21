declare module 'react-ga4' {
    export function initialize(measurementId: string): void
    export function send(hitType: string, options?: object): void
    export function event(options: object): void
}
