import { Box, Button, createStyles, Divider, FormControl, Input, InputLabel, makeStyles, Typography } from '@material-ui/core';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import BazaarScannerData from './components/bazaarScannerData';
import { InputError } from './constants/errors';
import { ItemDataType, TableDataType } from './constants/types';
import * as ApiHandler from './scripts/apiHandler';
const ElectronStore = window.require('electron-store');

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing(2),
    },
    container: {
      margin: '5px',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      alignContent: 'space-around',
    },
    item: {
      margin: '5px',
      flexShrink: 0,
    },
  })
);

function App() {
  const classes = useStyles();

  const [configManager] = useState(new ElectronStore());
  const [apiKey, setApiKey] = useState<string>(configManager.get("apiKey", ""));
  const [itemName, setItemName] = useState<string>(configManager.get("itemName", ""));
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [isFormFieldValid, setIsFormFieldValid] = useState({ apiKey: true, itemName: true });

  // Table information
  const [tableData, setTableData] = useState<TableDataType>();
  const [selectedItem, setSelectedItem] = useState<ItemDataType>();
  const [loading, setLoading] = useState(false);

  const itemInputRef = useRef<HTMLElement>(null)

  function isValidData() {
    let validationState = {
      apiKey: apiKey.length === 16,
      itemName: !!itemName.length,
    }

    setIsFormFieldValid(validationState)
    return Object.values(validationState).every(element => element === true)
  }

  useEffect(() => {
    itemInputRef.current?.focus()
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isValidData()) {
      setErrorMessage("");
      setLoading(true);

      searchItem();
    }
  }

  async function searchItem() {
    try {
      let enteredItem = await ApiHandler.getItem(itemName, apiKey);
      if (enteredItem !== undefined) {
        ApiHandler.getJson(processListings, { key: apiKey, category: 'market', id: enteredItem.id, selections: 'bazaar', hasField: true });
        setSelectedItem(enteredItem);
        configManager.set({ apiKey: apiKey, itemName: itemName })
      }
      else
        throw new InputError(`${itemName} not found in items`);
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        setErrorMessage(error.message)
      }
      else
        setErrorMessage(`An unexpected error was encountered: ${error}`)
    }
  }

  function processListings(json: Array<{ "ID": string, "cost": number, "quantity": number }>) {
    setLoading(false);
    let listings: TableDataType = json.map(x => { return { quantity: x.quantity, cost: x.cost, total_cost: x.cost * x.quantity, id: x.ID } });
    setTableData(listings);
  }

  return (
    <React.Fragment>
      <div className={classes.root} style={{height: "100vh"}}>
        <form id="search-bazaar-form" onSubmit={handleSubmit} className={classes.container}>

          <Box className={classes.container} flexGrow="1">
            <FormControl className={classes.item} error={!isFormFieldValid.apiKey} >
              <InputLabel htmlFor="apiKey">API Key</InputLabel>
              <Input id="apiKey" value={apiKey} onChange={e => setApiKey(e.target.value)} aria-describedby="apiKey-error" />
            </FormControl>

            <FormControl className={classes.item} error={!isFormFieldValid.itemName && !itemName.length}>
              <InputLabel htmlFor="itemName">Item Name</InputLabel>
              <Input id="itemName" value={itemName} onChange={e => setItemName(e.target.value)} inputRef={itemInputRef}/>
            </FormControl>
          </Box>

          <Button type='submit' name='search-button' variant="contained" color="primary" className={classes.item}>Search</Button>
        </form>
        <Divider />
        {!errorMessage.length ?
          <BazaarScannerData selectedItem={() => selectedItem} tableData={() => tableData} loading={loading} />
          :
          <Typography variant="h2" style={{margin: '10px'}}>{errorMessage}</Typography>
        }
      </div>
    </React.Fragment>
  );
}

export default App;
