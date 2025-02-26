import React from 'react'
import ReactDOM from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'

import ProjectsListView from '../components/views/projects/list'
import DatabaseProvider, { UNSAFE_close } from '../providers/database_provider'

afterAll(async () => {
    await UNSAFE_close()
})

it('renders without crashing', () => {
    const div = document.createElement('div')
    const root = ReactDOM.createRoot(div)
    root.render(
        <DatabaseProvider>
            <MemoryRouter>
                <ProjectsListView />
            </MemoryRouter>
        </DatabaseProvider>,
    )
})
