import { FC } from 'react'
import Table from 'react-bootstrap/Table'

interface TableProps {
    children: React.ReactNode
}

/**
 * A component that wraps a Table component in order to preset some Table props
 *
 * @param children Passed on to the Table component
 */
const TableWrapper: FC<TableProps> = ({ children }) => {
    return (
        <Table bordered responsive>
            {children}
        </Table>
    )
}

export default TableWrapper
