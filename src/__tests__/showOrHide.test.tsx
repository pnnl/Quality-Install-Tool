import { render, screen } from '@testing-library/react'
import ShowOrHide from '../components/show_or_hide'

describe('ShowOrHide Component', () => {
    test('renders children when "visible" prop is true', () => {
        render(
            <ShowOrHide visible={true}>
                <div>Visible Content</div>
            </ShowOrHide>,
        )

        // Assert that the content is rendered
        expect(screen.getByText('Visible Content')).toBeInTheDocument()
    })

    test('does not render children when "visible" prop is false', () => {
        render(
            <ShowOrHide visible={false}>
                <div>Invisible Content</div>
            </ShowOrHide>,
        )

        // Assert that the content is not rendered
        expect(screen.queryByText('Invisible Content')).not.toBeInTheDocument()
    })

    test('renders children when path and value match in context', () => {
        render(
            <ShowOrHide visible={false} value="WA" pathValue="WA">
                <div>Location is WA</div>
            </ShowOrHide>,
        )

        // Assert that the content is rendered because the path and value match
        expect(screen.getByText('Location is WA')).toBeInTheDocument()
    })

    test('renders children when path and value match in parent data', () => {
        render(
            <ShowOrHide visible={false} value="CA" pathValue="CA">
                <div>Content Visible with Parent Data</div>
            </ShowOrHide>,
        )

        const content = screen.getByText('Content Visible with Parent Data')
        // Assert that the content is rendered because the parent data matches the path and value
        expect(content).toBeInTheDocument()
    })

    test('does not render children when parent document is passed and path does not match', () => {
        render(
            <ShowOrHide visible={false} value="CA" pathValue="NY">
                <div>Content Visible with Parent Data</div>
            </ShowOrHide>,
        )

        // Assert that the content is not rendered because the path and value do not match in parent data
        expect(
            screen.queryByText('Content Visible with Parent Data'),
        ).not.toBeInTheDocument()
    })
})
