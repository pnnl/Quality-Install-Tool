import { get } from 'lodash'
import React, { FC } from 'react'

import { StoreContext } from './store'

import { pathToId } from '../utilities/paths_utils'
import SaveCancelButton from './save_cancel_button'

interface SaveCancelButtonWrapperProps {
    label: string
    path: string
}

const SaveCancelButtonWrapper: FC<SaveCancelButtonWrapperProps> = ({
    label,
    path,
}) => {
    // Generate an id for the input
    const id = pathToId(path, 'input')

    return (
        <StoreContext.Consumer>
            {({ docId, metadata, upsertMetadata }) => {
                const metadata_val = metadata as { status: string }
                return (
                    <SaveCancelButton
                        id={docId}
                        label={label}
                        updateValue={(value: any) =>
                            upsertMetadata(path, value)
                        }
                        value={get(metadata, path)}
                        doc_status={metadata_val?.status}
                    />
                )
            }}
        </StoreContext.Consumer>
    )
}

export default SaveCancelButtonWrapper
