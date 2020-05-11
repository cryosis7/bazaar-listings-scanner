import Head from 'next/head';
import Link from 'next/link';
import { Typography, TextField, Input, FilledInput, InputLabel, Divider, Button } from "@material-ui/core";
import { useState, useRef } from 'react'

import ListingsTable from '../components/listingsTable';
const ApiHandler = require('../../scripts/apiHandler');
import ApiError from '../../scripts/errors/apiError'

// const formFields = {}

export default function HomePage() {
    const [formData, setFormData] = useState({ apiKey: 'oWCYcYDXgqhiQGeX', numResults: '10' });
    const [tableData, setTableData] = useState();

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
                    <Button name='search-button' onClick={searchItem} variant="contained" color="primary">Search</Button>
                </form>
                <br />
                <Divider />
                <ListingsTable itemName={() => formData.itemName} tableData={() => tableData} numResults={() => formData.numResults} />
            </div>
        </>
    )

    async function searchItem() {
        // if (validForm()) { //TODO: validate form data
        try {
            let itemId = await ApiHandler.getItemId(formData.itemName, formData.apiKey);
            // TODO: Valid id?

            ApiHandler.getJson(processListings, { key: formData.apiKey, category: 'market', id: itemId, selections: 'bazaar', hasField: true });
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
