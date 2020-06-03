import Head from 'next/head';
import { TextField, Divider, Button } from "@material-ui/core";
import { useState, useRef } from 'react'

import BazaarScannerData from '../components/bazaarScannerData';
const ApiHandler = require('../../scripts/apiHandler');
const DataStore = require('../../scripts/dataStore');

export default function HomePage() {
    const [formData, setFormData] = useState(DataStore.readData()); //TODO: Replace with on submit data
    const [tableData, setTableData] = useState();
    const [selectedItem, setSelectedItem] = useState();
    const [formValidationState, setFormValidationState] = useState({apiKey: true, itemName: true, numResults: true});
    const [loading, setLoading] = useState(false);

    function validate(values) {
        let validationState = {}
        validationState.apiKey = (values.apiKey && values.apiKey.length === 16) ? true : false
        validationState.itemName = (values.itemName) ? true : false
        validationState.numResults = (values.numResults && values.numResults > 0) ? true : false
        
        setFormValidationState(validationState)
        return Object.values(validationState).reduce((accumulated, current) => accumulated && current)
    }

    function handleFormChange(event) {
        formData[event.target.name] = event.target.value;
        setFormData(formData);
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (validate(formData)) {
            searchItem();
        }
    }

    return (
        <>
            <Head>
                <title>Bazaar Listings Scanner</title>
            </Head>

            <div>
                <form id="search-bazaar-form" onSubmit={handleSubmit} >
                    <TextField name="apiKey" label="API Key" onChange={handleFormChange} defaultValue={formData ? formData.apiKey : ''}
                        error={!formValidationState.apiKey} helperText={!formValidationState.apiKey && "Invalid Api Key"} />
                    <TextField name='itemName' label="Enter Item" onChange={handleFormChange} 
                        error={!formValidationState.itemName} helperText={!formValidationState.itemName && "Invalid Item"} />
                    <TextField name='numResults' label="Number of Results" type="number" defaultValue={formData ? formData.numResults : ''}
                        inputProps={{ min: '1' }} onChange={handleFormChange} error={!formValidationState.numResults}/>

                    <Button type='submit' name='search-button' variant="contained" color="primary">Search</Button>
                </form>
                <br />
                <Divider />
                <BazaarScannerData selectedItem={() => selectedItem} tableData={() => tableData} numResults={() => formData.numResults} loading={loading}/>
            </div>
        </>
    )

    async function searchItem() {
        setLoading(true);
        try {
            let enteredItem = await ApiHandler.getItem(formData.itemName, formData.apiKey);
            if (enteredItem !== undefined) {
                ApiHandler.getJson(processListings, { key: formData.apiKey, category: 'market', id: enteredItem.id, selections: 'bazaar', hasField: true });
                setSelectedItem(enteredItem);
                DataStore.storeData(formData)
            }
            else
                throw Error(`${formData.itemName} not found in items`)
        } catch (error) {
            setLoading(false);
            console.error('Error occurred while processing search:', error)
        }
    }

    function processListings(json) {
        setLoading(false);
        let listings = json.map(x => { return { 'quantity': x.quantity, 'cost': x.cost, 'total-cost': x.cost * x.quantity, 'id': x.ID } });
        setTableData(listings);
    }
}
