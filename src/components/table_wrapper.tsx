import React from 'react'
import { Table } from 'react-bootstrap'

interface TableProps {
    children: React.ReactNode
}

const TableWrapper: React.FC<TableProps> = ({ children }) => {
    return (
        <Table bordered responsive>
            {children}
        </Table>
    )
}

export default TableWrapper
