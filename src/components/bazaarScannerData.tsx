import { Paper, Typography, LinearProgress, makeStyles, createStyles } from "@material-ui/core";
import ListingsTable from "./listingsTable";
import React from "react";
import { TableDataType, ItemDataType } from "../constants/types";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            margin: '5px',
        },
    })
);

export default function BazaarScannerData(props: {
    selectedItem: () => ItemDataType | undefined,
    tableData: () => TableDataType | undefined,
    numResults: () => number,
    loading: boolean
}) {
    const classes = useStyles();
    const selectedItem = props.selectedItem();

    return (
        <React.Fragment>
            {props.loading ?
                <LinearProgress />
            :
                <div className={classes.root}>
                    {(selectedItem?.properName.length) ? (
                        <React.Fragment>
                            <Typography variant='h6' gutterBottom>
                                {selectedItem.properName}
                            </Typography>
                            <ListingsTable tableData={props.tableData} numResults={props.numResults} />
                        </React.Fragment>
                    ) : (
                        <Typography variant="h6" gutterBottom>
                            Enter an item to search
                        </Typography>
                        )}
                </div>
            }
        </React.Fragment>
    );
}