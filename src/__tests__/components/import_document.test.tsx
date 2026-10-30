import React from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import ImportDoc from '../../components/views/projects/list/import_document'
import { importJSONDocument } from '../../utilities/json_serialization_utils'

jest.mock('../../providers/database_provider', () => ({
    useDatabase: jest.fn(),
}))

jest.mock('../../utilities/json_serialization_utils', () => ({
    JSON_DOCUMENT_FILE_EXTENSION: '.json',
    importJSONDocument: jest.fn(),
}))

const importDocument = jest.mocked(importJSONDocument)

describe('ImportDoc', () => {
    let readers: FileReader[]
    const file = new File(['{}'], 'project.json')

    beforeEach(() => {
        readers = []
        jest.spyOn(FileReader.prototype, 'readAsText').mockImplementation(
            function (this: FileReader) {
                readers.push(this)
            },
        )
        importDocument.mockResolvedValue([
            { ok: true, id: 'project', rev: '1' },
        ])
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    const selectFile = (container: HTMLElement) => {
        fireEvent.change(container.querySelector('input') as HTMLInputElement, {
            target: { files: [file] },
        })
    }

    const finishReading = async (text = '{}') => {
        const reader = readers[readers.length - 1]
        Object.defineProperty(reader, 'result', { value: text })
        await act(async () => {
            reader.onload?.call(
                reader,
                new ProgressEvent('load') as ProgressEvent<FileReader>,
            )
        })
    }

    test('prevents overlapping imports and allows importing the same file again', async () => {
        const onImport = jest.fn()
        const { container } = render(
            <ImportDoc label="Import Project" onImport={onImport} />,
        )

        selectFile(container)
        expect(screen.getByRole('button')).toBeDisabled()
        expect(screen.getByRole('button')).toHaveTextContent('Importing...')
        selectFile(container)
        expect(readers).toHaveLength(1)

        await finishReading()
        expect(onImport).toHaveBeenCalledTimes(1)
        expect(screen.getByRole('button')).toBeEnabled()

        selectFile(container)
        await finishReading()
        expect(onImport).toHaveBeenCalledTimes(2)
    })

    test('keeps controls disabled until the project list refresh finishes', async () => {
        let finishRefresh: () => void = () => undefined
        const onImport = jest.fn(
            () =>
                new Promise<void>(resolve => {
                    finishRefresh = resolve
                }),
        )
        const { container } = render(
            <ImportDoc label="Import Project" onImport={onImport} />,
        )
        selectFile(container)
        await finishReading()
        expect(screen.getByRole('button')).toBeDisabled()

        await act(async () => finishRefresh())
        expect(screen.getByRole('button')).toBeEnabled()
    })

    test.each(['error', 'abort'] as const)(
        'reports a file read %s and permits retry',
        async eventType => {
            const { container } = render(
                <ImportDoc label="Import Project" onImport={jest.fn()} />,
            )
            selectFile(container)
            const reader = readers[0]
            await act(async () => {
                const handler =
                    eventType === 'error' ? reader.onerror : reader.onabort
                handler?.call(
                    reader,
                    new ProgressEvent(eventType) as ProgressEvent<FileReader>,
                )
            })

            expect(screen.getByRole('alert')).toHaveTextContent(
                /Failed to read file|cancelled/,
            )
            expect(screen.getByRole('button')).toBeEnabled()
            expect(importDocument).not.toHaveBeenCalled()
            selectFile(container)
            await finishReading()
            expect(screen.queryByRole('alert')).not.toBeInTheDocument()
        },
    )

    test('reports synchronous file read failures', async () => {
        jest.spyOn(FileReader.prototype, 'readAsText').mockImplementation(
            () => {
                throw new Error('Reader unavailable')
            },
        )
        const { container } = render(
            <ImportDoc label="Import Project" onImport={jest.fn()} />,
        )
        selectFile(container)
        await waitFor(() =>
            expect(screen.getByRole('alert')).toHaveTextContent(
                'Reader unavailable',
            ),
        )
        expect(screen.getByRole('button')).toBeEnabled()
    })

    test('reports invalid JSON without writing to the database', async () => {
        const { container } = render(
            <ImportDoc label="Import Project" onImport={jest.fn()} />,
        )
        selectFile(container)
        await finishReading('not JSON')
        expect(screen.getByRole('alert')).toHaveTextContent(
            'Failed to parse as JSON',
        )
        expect(importDocument).not.toHaveBeenCalled()
        expect(screen.getByRole('button')).toBeEnabled()
    })

    test('reports database rejections and restores controls', async () => {
        importDocument.mockRejectedValue(new Error('Storage unavailable'))
        const onImport = jest.fn()
        const { container } = render(
            <ImportDoc label="Import Project" onImport={onImport} />,
        )
        selectFile(container)
        await finishReading()
        expect(screen.getByRole('alert')).toHaveTextContent(
            'Storage unavailable',
        )
        expect(onImport).not.toHaveBeenCalled()
        expect(screen.getByRole('button')).toBeEnabled()
    })

    test('refreshes partial imports and reports per-document failures', async () => {
        const responses = [
            { ok: true, id: 'project', rev: '1' },
            {
                error: true,
                status: 409,
                name: 'conflict',
                message: 'Document conflict',
            },
        ]
        importDocument.mockResolvedValue(responses)
        const onImport = jest.fn()
        const { container } = render(
            <ImportDoc label="Import Project" onImport={onImport} />,
        )
        selectFile(container)
        await finishReading()
        expect(onImport).toHaveBeenCalledWith(responses)
        expect(screen.getByRole('alert')).toHaveTextContent(
            'Failed to import 1 of 2 documents: Document conflict',
        )
        expect(screen.getByRole('alert')).toHaveTextContent(
            'Some documents may already have been imported',
        )
        expect(screen.getByRole('button')).toBeEnabled()
    })
})
