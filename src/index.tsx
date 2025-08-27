import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import reportWebVitals from './reportWebVitals'

const env = process.env.REACT_APP_ENV
// Digital Analytics Program - Universal Analytics https://digital.gov/guides/dap/
if (env === 'production' && !document.getElementById('_fed_an_ua_tag')) {
    const script = document.createElement('script')
    script.id = '_fed_an_ua_tag'
    script.async = true
    script.type = 'text/javascript'
    script.src =
        'https://dap.digitalgov.gov/Universal-Federated-Analytics-Min.js?agency=AGENCY&subagency=PNNL'
    document.head.appendChild(script)
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// Register the service worker
serviceWorkerRegistration.register({
    onUpdate: (registration: ServiceWorkerRegistration) => {
        console.log('Service worker updated', registration)
    },
    onSuccess: (registration: ServiceWorkerRegistration) => {
        console.log('Service worker registered', registration)
    },
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
