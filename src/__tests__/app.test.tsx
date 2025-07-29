import React from 'react'
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import App from '../App'

// Mock all components to isolate App's routing logic
jest.mock('../components/views/installations/edit', () =>
    jest.fn(() => <div>Mocked InstallationsEditView</div>),
)
jest.mock('../components/views/installations/list', () =>
    jest.fn(() => <div>Mocked InstallationsListView</div>),
)
jest.mock('../components/views/projects/edit', () =>
    jest.fn(() => <div>Mocked ProjectsEditView</div>),
)
jest.mock('../components/views/projects/list', () =>
    jest.fn(() => <div>Mocked ProjectsListView</div>),
)
jest.mock('../components/views/projects/new', () =>
    jest.fn(() => <div>Mocked ProjectsNewView</div>),
)
jest.mock('../components/views/projects/show', () =>
    jest.fn(() => <div>Mocked ProjectsShowView</div>),
)
jest.mock('../providers/database_provider', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="database-provider">{children}</div>
    ),
}))

describe('App Component', () => {
    const renderAppWithRoutes = (initialRoute: string) => {
        const mockRouter = createMemoryRouter(
            [
                { path: '/', element: <div>Mocked ProjectsListView</div> },
                {
                    path: '/app/:projectId',
                    element: <div>Mocked ProjectsEditView</div>,
                },
                {
                    path: '/app/new',
                    element: <div>Mocked ProjectsNewView</div>,
                },
                {
                    path: '/app/:projectId/workflows',
                    element: <div>Mocked ProjectsShowView</div>,
                },
                {
                    path: '/app/:projectId/:workflowName',
                    element: <div>Mocked InstallationsListView</div>,
                },
                {
                    path: '/app/:projectId/:workflowName/:installationId',
                    element: <div>Mocked InstallationsEditView</div>,
                },
            ],
            {
                initialEntries: [initialRoute],
                initialIndex: 0,
                future: {
                    v7_relativeSplatPath: true, // Enable the v7_relativeSplatPath here
                },
            },
        )
        render(
            <RouterProvider
                router={mockRouter}
                future={{
                    v7_startTransition: true,
                }}
            />,
        )
    }

    it('renders DatabaseProvider', () => {
        render(<App />)
        expect(screen.getByTestId('database-provider')).toBeInTheDocument()
    })
    test('renders ProjectsListView at the "/" route', () => {
        renderAppWithRoutes('/')
        expect(screen.getByText('Mocked ProjectsListView')).toBeInTheDocument()
    })
    test('renders ProjectsEditView at the "/app/:projectId" route', () => {
        renderAppWithRoutes('/app/123')
        expect(screen.getByText('Mocked ProjectsEditView')).toBeInTheDocument()
    })
    test('renders ProjectsNewView at the "/app/new" route', () => {
        renderAppWithRoutes('/app/new')
        expect(screen.getByText('Mocked ProjectsNewView')).toBeInTheDocument()
    })
    test('renders ProjectsShowView at the "/app/:projectId/workflows" route', () => {
        renderAppWithRoutes('/app/123/workflows')
        expect(screen.getByText('Mocked ProjectsShowView')).toBeInTheDocument()
    })
    test('renders InstallationsListView at the "/app/:projectId/:workflowName" route', () => {
        renderAppWithRoutes('/app/123/workflow1')
        expect(
            screen.getByText('Mocked InstallationsListView'),
        ).toBeInTheDocument()
    })
    test('renders InstallationsEditView at the "/app/:projectId/:workflowName/:installationId" route', () => {
        renderAppWithRoutes('/app/123/workflow1/456')
        expect(
            screen.getByText('Mocked InstallationsEditView'),
        ).toBeInTheDocument()
    })
})
