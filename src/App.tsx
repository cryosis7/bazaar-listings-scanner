import React, { useState, FormEvent } from 'react';
// import './App.css';

import * as ApiHandler from './scripts/apiHandler';
import { FormControl, InputLabel, Input, Button, Divider, makeStyles, createStyles } from '@material-ui/core';
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
      padding: '5px',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      alignContent: 'space-around',
    },
    item: {
      margin: '5px',
    },
    search_button: {
      flexBasis: '100%'
    }
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
        console.debug('Invalid Item Name');
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
          <FormControl error={!isFormFieldValid.apiKey} className={classes.item}>
            <InputLabel htmlFor="apiKey">API Key</InputLabel>
            <Input id="apiKey" value={apiKey} onChange={e => setApiKey(e.target.value)} aria-describedby="apiKey-error" />
          </FormControl>
          {/* <TextField name="apiKey" label="API Key" onChange={handleFormChange} defaultValue={formData?.apiKey || ''}
              error={!isFormFieldValid.apiKey} helperText={!isFormFieldValid.apiKey && "Invalid Api Key"} /> */}
          <FormControl className={classes.item}>
            <InputLabel htmlFor="itemName">Item Name</InputLabel>
            <Input id="itemName" value={itemName} onChange={e => setItemName(e.target.value)} />
          </FormControl>
          {/* <TextField name='itemName' label="Enter Item" onChange={handleFormChange}
              error={!isFormFieldValid.itemName} helperText={!isFormFieldValid.itemName && "Invalid Item"} /> */}

          <div className={[classes.item, classes.search_button].join(' ')}>
            <Button type='submit' name='search-button' variant="contained" color="primary">Search</Button>
          </div>
        </form>
        <Divider />
        <BazaarScannerData selectedItem={() => selectedItem} tableData={() => tableData} loading={loading} />
      </div>
    </React.Fragment>
  );
}

export default App;
