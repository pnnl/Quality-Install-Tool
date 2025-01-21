// src/analytics.ts
import ReactGA from 'react-ga4'

// Initialize Google Analytics with your GA4 Measurement ID
export const initGA = () => {
    ReactGA.initialize('G-7FNPEPVSPQ') // Replace with your GA4 Measurement ID
}

// Log page views
export const logPageView = () => {
    ReactGA.send('pageview')
}

// Optional: Log custom events
export const logEvent = (category: string, action: string, label?: string) => {
    ReactGA.event({
        category,
        action,
        label,
    })
}
