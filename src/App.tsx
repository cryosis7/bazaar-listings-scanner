import React, { useState, FormEvent } from 'react';
// import './App.css';

import * as ApiHandler from './scripts/apiHandler';
import { FormControl, InputLabel, Input, Button, Divider, makeStyles, createStyles, Container, Box } from '@material-ui/core';
import { InputError } from './constants/errors';
import { ItemDataType, TableDataType } from './constants/types';
import BazaarScannerData from './components/bazaarScannerData';
const ElectronStore = window.require('electron-store');

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing(2),
      overflow: 'hidden',
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

  const [isFormFieldValid, setIsFormFieldValid] = useState({ apiKey: true, itemName: true });

  // Table information
  const [tableData, setTableData] = useState<TableDataType>();
  const [selectedItem, setSelectedItem] = useState<ItemDataType>();
  const [loading, setLoading] = useState(false);

  function isValidData() {
    let validationState = {
      apiKey: apiKey.length === 16,
      itemName: !!itemName.length,
    }

    setIsFormFieldValid(validationState)
    return Object.values(validationState).every(element => element === true)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isValidData()) {
      searchItem();
    }
  }

  async function searchItem() {
    setLoading(true);

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
      if (error instanceof InputError)
        console.error('Invalid Item Name');
      else
        console.error('Error occurred while processing search:', error)
    }
  }

  function processListings(json: Array<{ "ID": string, "cost": number, "quantity": number }>) {
    setLoading(false);
    let listings: TableDataType = json.map(x => { return { quantity: x.quantity, cost: x.cost, total_cost: x.cost * x.quantity, id: x.ID } });
    setTableData(listings);
  }

  return (
    <React.Fragment>
      <div className={classes.root}>
        <form id="search-bazaar-form" onSubmit={handleSubmit} className={classes.container}>

          <Box className={classes.container} flexGrow="1">
            <FormControl className={classes.item} error={!isFormFieldValid.apiKey} >
              <InputLabel htmlFor="apiKey">API Key</InputLabel>
              <Input id="apiKey" value={apiKey} onChange={e => setApiKey(e.target.value)} aria-describedby="apiKey-error" />
            </FormControl>

            <FormControl className={classes.item} error={!isFormFieldValid.itemName && !itemName.length}>
              <InputLabel htmlFor="itemName">Item Name</InputLabel>
              <Input id="itemName" value={itemName} onChange={e => setItemName(e.target.value)} />
            </FormControl>
          </Box>

          <Button type='submit' name='search-button' variant="contained" color="primary" className={classes.item}>Search</Button>
        </form>
        <Divider />
        <BazaarScannerData selectedItem={() => selectedItem} tableData={() => tableData} loading={loading} />
      </div>
    </React.Fragment>
  );
}

export default App;
