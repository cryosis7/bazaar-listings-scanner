import { Paper, Typography, makeStyles, createStyles } from "@material-ui/core";
import ListingsTable from "./listingsTable";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing(2),
    },
  })
);

export default function BazaarScannerData(props) {    
    const classes = useStyles();
    const selectedItem = props.selectedItem();
    
    return (
        <Paper className={classes.root} elevation={1} tabIndex={-1}>
            {(selectedItem && selectedItem.properName && selectedItem.properName.length) ? (
                <>
                    <Paper elevation={2}>
                        <Typography variant='h6' gutterBottom>
                            {selectedItem.properName}
                        </Typography>
                    </Paper>
                    <ListingsTable tableData={props.tableData} numResults={props.numResults} />
                </>
            ) : (
                    <Typography variant="h6">
                        Enter an item to search
                    </Typography>
                )}
        </Paper>
    );
}