import { createStyles, makeStyles, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Typography } from "@material-ui/core";
import React from "react";
import { TableDataType } from "../constants/types";
import { priceFormatter } from '../scripts/utils';
import TablePaginationActions from "./TablePaginationActions";
const ElectronStore = window.require('electron-store');

const configManager = new ElectronStore();

const useStyles = makeStyles((theme) =>
    createStyles({
        table: {
            tableLayout: 'fixed',
        },
    })
);

interface Column {
    id: "quantity" | "cost" | "total_cost";
    label: string;
    isMoney: boolean;
}
const TABLE_COLUMNS: ReadonlyArray<Column> = [
    { id: 'quantity', label: 'Quantity', isMoney: false },
    { id: 'cost', label: 'Cost', isMoney: true },
    { id: 'total_cost', label: 'Total Cost', isMoney: true },
];

export default function ListingsTable(props: { tableData: () => TableDataType | undefined }) {
    const classes = useStyles();
    const tableData = props.tableData();

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(configManager.get("rowsPerPage", 10));

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        let rpp = parseInt(event.target.value, 10);
        setRowsPerPage(rpp);
        setPage(0);
        configManager.set("rowsPerPage", rpp)
    };

    return (
        <React.Fragment>
            {(tableData?.length) ? (
                <TableContainer>
                    <Table stickyHeader className={classes.table}>
                        <TableHead>
                            <TableRow>
                                {TABLE_COLUMNS.map(column => (
                                    <TableCell key={column.id} align='center'>
                                        <Typography variant="subtitle1">
                                            {column.label}
                                        </Typography>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((listing) => (
                                <TableRow key={listing.id}>
                                    {TABLE_COLUMNS.map((column) => (
                                        <TableCell align='center' key={listing.id + column.id}>
                                            {column.isMoney ? priceFormatter(listing[column.id]) : listing[column.id].toLocaleString('en-US')}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    colSpan={3}
                                    count={tableData.length}
                                    SelectProps={{ inputProps: { 'aria-label': 'rows per page' }, native: true }}
                                    page={page}
                                    rowsPerPage={rowsPerPage}
                                    rowsPerPageOptions={[5, 10, 20, 50, { label: 'All', value: -1 }]}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
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