import React, { useState, FormEvent } from 'react';
// import './App.css';

import * as ApiHandler from './scripts/apiHandler';
import { FormControl, InputLabel, Input, Button, Divider, makeStyles, createStyles } from '@material-ui/core';
import { InputError } from './constants/errors';
import { ItemDataType, TableDataType } from './constants/types';
import BazaarScannerData from './components/bazaarScannerData';
import classes from '*.module.css';
const ElectronStore = window.require('electron-store');

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            textAlign: 'center',
            paddingTop: theme.spacing(2),
        },
    })
);

function App() {
  const classes = useStyles();
  
  const [configManager] = useState(new ElectronStore());
  const [apiKey, setApiKey] = useState<string>(configManager.get("apiKey", ""));
  const [itemName, setItemName] = useState<string>(configManager.get("itemName", ""));
  const [numResults, setNumResults] = useState<number>(configManager.get("numResults", 10));

  const [isFormFieldValid, setIsFormFieldValid] = useState({ apiKey: true, itemName: true, numResults: true });

  // Table information
  const [tableData, setTableData] = useState<TableDataType>();
  const [selectedItem, setSelectedItem] = useState<ItemDataType>();
  const [loading, setLoading] = useState(false);

  function isValidData() {
    let validationState = {
      apiKey: apiKey.length === 16,
      itemName: !!itemName.length,
      numResults: numResults > 0,
    }

    setIsFormFieldValid(validationState)
    return Object.values(validationState).reduce((accumulated, current) => accumulated && current)
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
        configManager.set({ apiKey: apiKey, itemName: itemName, numResults: numResults })
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
      <head>
        <title>Bazaar Scanner</title>
      </head>

      <div className={classes.root}>
        <form id="search-bazaar-form" onSubmit={handleSubmit} >
          <FormControl error={!isFormFieldValid.apiKey}>
            <InputLabel htmlFor="apiKey">API Key</InputLabel>
            <Input id="apiKey" value={apiKey} onChange={e => setApiKey(e.target.value)} aria-describedby="apiKey-error" />
          </FormControl>
          {/* <TextField name="apiKey" label="API Key" onChange={handleFormChange} defaultValue={formData?.apiKey || ''}
              error={!isFormFieldValid.apiKey} helperText={!isFormFieldValid.apiKey && "Invalid Api Key"} /> */}
          <FormControl>
            <InputLabel htmlFor="itemName">Item Name</InputLabel>
            <Input id="itemName" value={itemName} onChange={e => setItemName(e.target.value)} />
          </FormControl>
          {/* <TextField name='itemName' label="Enter Item" onChange={handleFormChange}
              error={!isFormFieldValid.itemName} helperText={!isFormFieldValid.itemName && "Invalid Item"} /> */}
          <FormControl>
            <InputLabel htmlFor="numResults">Number of Results</InputLabel>
            <Input id="numResults" type="number" value={numResults} onChange={e => setNumResults(parseInt(e.target.value))} />
          </FormControl>
          {/* <TextField name='numResults' label="Number of Results" type="number" defaultValue={formData?.numResults || ''}
            inputProps={{ min: '1' }} onChange={handleFormChange} error={!isFormFieldValid.numResults} /> */}

          <Button type='submit' name='search-button' variant="contained" color="primary">Search</Button>
        </form>
        <br />
        <Divider />
        <BazaarScannerData selectedItem={() => selectedItem} tableData={() => tableData} numResults={() => numResults} loading={loading} />
      </div>
    </React.Fragment>
  );
}

export default App;
