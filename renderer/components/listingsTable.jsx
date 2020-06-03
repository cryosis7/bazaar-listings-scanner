import { TablePagination, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography } from "@material-ui/core";
import { priceFormatter, toTitleCase } from '../../scripts/utils'

const TABLE_COLUMNS = [
    { id: 'quantity', label: 'Quantity', align: 'center' },
    { id: 'cost', label: 'Cost', isMoney: true, align: 'right' },
    { id: 'total-cost', label: 'Total Cost', isMoney: true, align: 'right' }
];

export default function ListingsTable(props) {
    const tableData = props.tableData();

    return (
        <Paper elevation={2}>
            {(tableData && tableData.length) ? (
                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {TABLE_COLUMNS.map(column => (
                                    <TableCell key={column.id} align={column.align}>
                                        <Typography variant="subtitle1">
                                            {column.label}
                                        </Typography>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.slice(0, props.numResults()).map((row) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                    {TABLE_COLUMNS.map((column) => (
                                        <TableCell align={column.align} key={row.id + column.id}>
                                            {column.isMoney ? priceFormatter(row[column.id]) : row[column.id].toLocaleString('en-US')}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                    <Typography variant="h6">
                        No bazaar listings to display
                    </Typography>
                )}
        </Paper>
    );
}