import { type NodeJS } from 'node'

declare namespace NodeJS {
    interface ProcessEnv {
        readonly NODE_ENV: 'development' | 'production' | 'test'
        readonly PUBLIC_URL: string

        readonly REACT_APP_NAME: string
        readonly REACT_APP_HOMEPAGE: string

        readonly REACT_APP_POUCHDB_DATABASE_NAME: string

        readonly REACT_APP_GEOLOCATION_MAXIMUM_AGE: string
        readonly REACT_APP_GEOLOCATION_TIMEOUT_MILLIS: string

        readonly REACT_APP_JSON_DOCUMENT_CONTENT_TYPE: string
        readonly REACT_APP_JSON_DOCUMENT_FILE_EXTENSION: string

        readonly REACT_APP_PHOTO_MAXIMUM_WIDTH_PX: string
        readonly REACT_APP_PHOTO_MAXIMUM_HEIGHT_PX: string
        readonly REACT_APP_PHOTO_MAXIMUM_SIZE_MB: string

        readonly REACT_APP_PRINT_TITLE: string
    }
}

declare module '*.avif' {
    const src: string
    export default src
}

declare module '*.bmp' {
    const src: string
    export default src
}

declare module '*.gif' {
    const src: string
    export default src
}

declare module '*.jpg' {
    const src: string
    export default src
}

declare module '*.jpeg' {
    const src: string
    export default src
}

declare module '*.png' {
    const src: string
    export default src
}

declare module '*.webp' {
    const src: string
    export default src
}

declare module '*.svg' {
    import * as React from 'react'

    export const ReactComponent: React.FunctionComponent<
        React.SVGProps<SVGSVGElement> & { title?: string }
    >

    const src: string
    export default src
}

declare module '*.module.css' {
    const classes: { readonly [key: string]: string }
    export default classes
}

declare module '*.module.scss' {
    const classes: { readonly [key: string]: string }
    export default classes
}

declare module '*.module.sass' {
    const classes: { readonly [key: string]: string }
    export default classes
}
