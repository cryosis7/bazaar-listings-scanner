import React from "react";
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography } from "@material-ui/core";
import { priceFormatter } from '../scripts/utils'
import { TableDataType } from "../constants/types";

interface Column {
    id: "quantity" | "cost" | "total_cost";
    label: string;
    isMoney: boolean;
    align: "left" | "center" | "right" | "inherit" | "justify";
}
const TABLE_COLUMNS: ReadonlyArray<Column> = [
    { id: 'quantity', label: 'Quantity', isMoney: false, align: 'center' },
    { id: 'cost', label: 'Cost', isMoney: true, align: 'right' },
    { id: 'total_cost', label: 'Total Cost', isMoney: true, align: 'right' },
];

export default function ListingsTable(props: { tableData: () => TableDataType | undefined, numResults: () => number }) {
    const tableData = props.tableData();

    return (
        <Paper elevation={2}>
            {(tableData?.length) ? (
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
                            {tableData.slice(0, props.numResults()).map((listing) => (
                                <TableRow tabIndex={-1} key={listing.id}>
                                    {TABLE_COLUMNS.map((column) => (
                                        <TableCell align={column.align} key={listing.id + column.id}>
                                            {column.isMoney ? priceFormatter(listing[column.id]) : listing[column.id].toLocaleString('en-US')}
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