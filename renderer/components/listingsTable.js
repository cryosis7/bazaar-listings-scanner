import { TablePagination, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography } from "@material-ui/core";
import { priceFormatter } from '../../scripts/utils'
import { useImperativeHandle, useState, forwardRef } from "react";

const TABLE_COLUMNS = [
    { id: 'quantity', label: 'Quantity', align: 'center' },
    { id: 'cost', label: 'Cost', isMoney: true, align: 'right' },
    { id: 'total-cost', label: 'Total Cost', isMoney: true, align: 'right' }
];

export default function ListingsTable(props, ref) {
    console.log(props)

    return (
        <Paper>
            {(props.tableData() && props.tableData().length) ? (
                <TableContainer>
                <Typography variant='h5' align='center'>
                    {props.itemName()}
                </Typography>
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
                            {props.tableData().slice(0, props.numResults()).map((row) => (
                                <TableRow hover role="checkbox" tabIndex={-1}>
                                    {TABLE_COLUMNS.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell align={column.align}>
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
                    <Typography variant="h6">
                        No bazaar listings to display
                    </Typography>
                )}
        </Paper>
    );
}