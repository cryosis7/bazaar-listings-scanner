import Head from 'next/head';
import { TextField, Divider, Button } from "@material-ui/core";
import { useState } from 'react'

import BazaarScannerData from '../components/bazaarScannerData';
const ApiHandler = require('../../scripts/apiHandler');

export default function HomePage() {
    const [formData, setFormData] = useState({ apiKey: 'oWCYcYDXgqhiQGeX', numResults: '10' });
    const [tableData, setTableData] = useState();
    const [selectedItem, setSelectedItem] = useState();

    function handleFormChange(event) {
        let data = formData;
        data[event.target.name] = event.target.value;
        setFormData(data);
    }

    return (
        <>
            <Head>
                <title>Bazaar Listings Scanner</title>
            </Head>

            <div>
                <form id="search-bazaar-form" >
                    <TextField name="apiKey" label="API Key" onChange={handleFormChange} value={formData.apiKey} />
                    <TextField name='itemName' label="Enter Item" onChange={handleFormChange} />
                    <TextField name='numResults' type="number" label="Number of Results" defaultValue={formData.numResults}
                        inputProps={{ min: '1' }} onChange={handleFormChange} />
                    <Button name='search-button' onClick={handleButtonClicked} onKeyPress={onKeyPress} variant="contained" color="primary">Search</Button>
                </form>
                <br />
                <Divider />
                <BazaarScannerData selectedItem={() => selectedItem} tableData={() => tableData} numResults={() => formData.numResults} />
            </div>
        </>
    )

    function onKeyPress(e) {
        if (e.which === 13)
            handleButtonClicked();
    }

    function handleButtonClicked() {
        searchItem()
    }

    async function searchItem() {
        // if (validForm()) { //TODO: validate form data
        try {
            let enteredItem = await ApiHandler.getItem(formData.itemName, formData.apiKey);
            console.info('enteredItem: ');
            console.info(enteredItem);
            if (enteredItem !== undefined) {
                setSelectedItem(enteredItem);
                ApiHandler.getJson(processListings, { key: formData.apiKey, category: 'market', id: enteredItem.id, selections: 'bazaar', hasField: true });
            }
            else
                throw Error(`${formData.itemName} not found in items`)
        } catch (error) {
            console.error('Error occurred while processing search:');
            console.error(error)
        }
        // }
        // else
        //     highlightErrors();
    }

    function processListings(json) {
        let listings = json.map(x => { return { 'quantity': x.quantity, 'cost': x.cost, 'total-cost': x.cost * x.quantity } });
        setTableData(listings);
    }
}
