import React from "react";
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography, makeStyles, createStyles } from "@material-ui/core";
import { priceFormatter } from '../scripts/utils'
import { TableDataType } from "../constants/types";

const useStyles = makeStyles((theme) =>
    createStyles({
        table: {
            tableLayout: 'fixed',
        },
        column: {
            // flexGrow: 1
        },
    })
);

interface Column {
    id: "quantity" | "cost" | "total_cost";
    label: string;
    isMoney: boolean;
}
const TABLE_COLUMNS: ReadonlyArray<Column> = [
    { id: 'quantity', label: 'Quantity', isMoney: false},
    { id: 'cost', label: 'Cost', isMoney: true},
    { id: 'total_cost', label: 'Total Cost', isMoney: true},
];

export default function ListingsTable(props: { tableData: () => TableDataType | undefined, numResults: () => number }) {
    const classes = useStyles();
    const tableData = props.tableData();

    return (
        <React.Fragment>
            {(tableData?.length) ? (
                <TableContainer>
                    <Table stickyHeader={true} className={classes.table}>
                        <TableHead>
                            <TableRow>
                                {TABLE_COLUMNS.map(column => (
                                    <TableCell key={column.id} align='center' className={classes.column}>
                                        <Typography variant="subtitle1">
                                            {column.label}
                                        </Typography>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.slice(0, props.numResults()).map((listing) => (
                                <TableRow key={listing.id}>
                                    {TABLE_COLUMNS.map((column) => (
                                        <TableCell align='center' key={listing.id + column.id}>
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
        </React.Fragment>
    );
}