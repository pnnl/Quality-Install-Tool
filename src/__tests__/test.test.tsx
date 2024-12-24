import ReactDOM from 'react-dom/client'
import Home from '../components/home'
import { MemoryRouter } from 'react-router-dom'

it('renders without crashing', () => {
    const div = document.createElement('div')
    const root = ReactDOM.createRoot(div) // Create root using new API
    root.render(
        <MemoryRouter>
            <Home />
        </MemoryRouter>,
    )
})
