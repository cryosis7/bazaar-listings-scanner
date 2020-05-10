import { TablePagination, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography } from "@material-ui/core";
import { useState } from 'react'
import { priceFormatter } from '../../scripts/utils'

const TABLE_COLUMNS = [
    { id: 'quantity', label: 'Quantity', align: 'center' },
    { id: 'cost', label: 'Cost', isMoney: true },
    { id: 'total-cost', label: 'Total Cost', isMoney: true }
];

export default function ListingsTable({ tableData }) {
    // const [tableData, setTableData] = useState(props.tableData);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper>
            {(tableData && tableData.length) ? (
                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {TABLE_COLUMNS.map(column => (
                                    <TableCell key={column.id} align={column.align}>
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.map((row) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                    {TABLE_COLUMNS.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.isMoney ? priceFormatter(value) : value.toLocaleString('en-US')}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                    <Typography variant="h2">
                        No bazaar listings to display
                    </Typography>
                )}
        </Paper>
    );
}