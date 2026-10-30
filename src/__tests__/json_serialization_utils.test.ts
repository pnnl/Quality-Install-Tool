import PouchDB from 'pouchdb'
import { randomUUID } from 'crypto'

import { type Base, type Project } from '../types/database.types'
import {
    importJSONDocument,
    type JSONDocument,
} from '../utilities/json_serialization_utils'
import {
    getProjectDocumentNames,
    newInstallation,
} from '../utilities/database_utils'

jest.mock('../utilities/database_utils', () => ({
    getProjectDocumentNames: jest.fn(),
    newInstallation: jest.fn(),
}))

jest.mock('../utilities/photo_resolution_utils', () => ({
    getDefaultProjectPhotoResolution: () => '1200',
}))

describe('importJSONDocument migrations', () => {
    const cryptoDescriptor = Object.getOwnPropertyDescriptor(
        globalThis,
        'crypto',
    )

    beforeAll(() => {
        Object.defineProperty(globalThis, 'crypto', {
            configurable: true,
            value: { randomUUID },
        })
    })

    afterAll(() => {
        if (cryptoDescriptor) {
            Object.defineProperty(globalThis, 'crypto', cryptoDescriptor)
        } else {
            Reflect.deleteProperty(globalThis, 'crypto')
        }
    })

    test('preserves combustion-safety children and links when adding photo resolution', async () => {
        jest.mocked(getProjectDocumentNames).mockResolvedValue([])
        jest.mocked(newInstallation).mockReturnValue({
            _id: 'safety-installation',
            type: 'installation',
            data_: {},
            metadata_: {
                doc_name: 'Legacy project',
                template_name: 'doe_combustion_appliance_safety_tests',
                attachments: {},
            },
        } as ReturnType<typeof newInstallation>)

        const bulkDocs = jest.fn().mockResolvedValue([])
        const db = {
            info: jest.fn().mockResolvedValue({}),
            bulkDocs,
        } as unknown as PouchDB.Database<Base>

        const data = {
            all_docs: [
                {
                    _id: 'old-project',
                    type: 'project',
                    children: ['old-workflow'],
                    data_: { assessment_date: '2020-01-01' },
                    metadata_: { doc_name: 'Legacy project', attachments: {} },
                },
                {
                    _id: 'old-workflow',
                    type: 'installation',
                    data_: {},
                    metadata_: {
                        template_name: 'doe_workflow_heat_pump_water_heater',
                        attachments: {},
                    },
                },
            ],
        } as unknown as JSONDocument

        await importJSONDocument(db, data)

        const docs = bulkDocs.mock.calls[0][0] as Array<
            PouchDB.Core.PutDocument<Base>
        >
        const project = docs.find(
            doc => doc.type === 'project',
        ) as PouchDB.Core.PutDocument<Project>
        const workflow = docs.find(doc => doc._id === project.children[0])
        const safetyInstallation = docs.find(
            doc => doc._id === 'safety-installation',
        )

        expect(docs).toHaveLength(3)
        expect(project.children).toEqual([workflow?._id, 'safety-installation'])
        expect(project.data_.photo?.resolution).toBe('1200')
        expect(project.data_).not.toHaveProperty('assessment_date')
        expect(safetyInstallation?.data_).toHaveProperty(
            'assessment_date',
            '2020-01-01',
        )
        expect(workflow?.data_.links).toHaveProperty(
            'doe_combustion_appliance_safety_test_doc_id',
            'safety-installation',
        )
    })
})
