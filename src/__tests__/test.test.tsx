import React from 'react'
import ReactDOM from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'

import ProjectsListView from '../components/views/projects/list'
import DatabaseProvider, { UNSAFE_close } from '../providers/database_provider'

// Mock the database provider
jest.mock('../providers/database_provider', () => {
    return {
        UNSAFE_close: jest.fn(),
        __esModule: true,
        default: ({ children }: { children: React.ReactNode }) => (
            <div data-testid="mock-database-provider">{children}</div>
        ),
    }
})

afterAll(async () => {
    await UNSAFE_close()
    jest.clearAllMocks()
})

describe('ProjectsListView Component', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div')
        const root = ReactDOM.createRoot(div)
        root.render(
            <DatabaseProvider>
                <MemoryRouter
                    future={{
                        v7_startTransition: true,
                        v7_relativeSplatPath: true,
                    }}
                >
                    <ProjectsListView />
                </MemoryRouter>
            </DatabaseProvider>,
        )
        root.unmount()
    })
})
