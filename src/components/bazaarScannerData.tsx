import { createStyles, LinearProgress, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { ItemDataType, TableDataType } from "../constants/types";
import ListingsTable from "./listingsTable";

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
                            <ListingsTable tableData={props.tableData} />
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