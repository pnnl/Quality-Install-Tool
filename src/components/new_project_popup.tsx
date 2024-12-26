import React, { useState, useEffect } from 'react'
import { Modal, Button, Card } from 'react-bootstrap'
import { StoreContext } from './store'
import { useDB } from '../utilities/database_utils'

export default function NewProjectPopup() {
    const db = useDB()
    const [projectList, setProjectList] = useState<any[]>([])

    const sortByEditTime = (jobsList: any[]) => {
        jobsList.sort((a, b) => {
            if (
                a.metadata_.last_modified_at.toString() <
                b.metadata_.last_modified_at.toString()
            ) {
                return 1
            } else if (
                a.metadata_.last_modified_at.toString() >
                b.metadata_.last_modified_at.toString()
            ) {
                return -1
            } else {
                return 0
            }
        })
    }

    const retrieveProjectInfo = async (): Promise<void> => {
        // Dynamically import the function when needed
        const { retrieveProjectDocs } = await import(
            '../utilities/database_utils'
        )

        retrieveProjectDocs(db).then(res => {
            setProjectList(res)
            sortByEditTime(res)
        })
    }

    useEffect(() => {
        retrieveProjectInfo()
    }, [])

    return (
        <Modal show={true}>
            <Modal.Header closeButton>
                <Modal.Title>New Project Autofill</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Would you like to autofill the New Project form with one of the
                following data sets?
                {/* Add logic here to autopopulate from storage */}
                <Card>Data set 1</Card>
                <Card>Data set 2</Card>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary">Skip</Button>
                <Button variant="danger">Autofill with chosen data</Button>
            </Modal.Footer>
        </Modal>
    )
}
