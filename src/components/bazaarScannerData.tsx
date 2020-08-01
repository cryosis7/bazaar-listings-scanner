import { Paper, Typography, LinearProgress } from "@material-ui/core";
import ListingsTable from "./listingsTable";
import React from "react";
import { TableDataType, ItemDataType } from "../constants/types";

// const useStyles = makeStyles((theme) =>
//     createStyles({
//         root: {
//             textAlign: 'center',
//             paddingTop: theme.spacing(2),
//         },
//     })
// );

export default function BazaarScannerData(props: {
    selectedItem: () => ItemDataType | undefined,
    tableData: () => TableDataType | undefined,
    numResults: () => number,
    loading: boolean
}) {

    const selectedItem = props.selectedItem();

    return (
        <>
            {props.loading ?
                <LinearProgress />
                :
                <Paper elevation={1} tabIndex={-1}>
                    {(selectedItem?.properName.length) ? (
                        <React.Fragment>
                            <Paper elevation={2}>
                                <Typography variant='h6' gutterBottom>
                                    {selectedItem.properName}
                                </Typography>
                            </Paper>
                            <ListingsTable tableData={props.tableData} numResults={props.numResults} />
                        </React.Fragment>
                    ) : (
                            <Typography variant="h6">
                                Enter an item to search
                            </Typography>
                        )}
                </Paper>
            }
        </>
    );
}