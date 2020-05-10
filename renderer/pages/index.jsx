import Head from 'next/head';
import Link from 'next/link';
import { Typography, TextField, Input, FilledInput, InputLabel, Divider, Button } from "@material-ui/core";

import ListingsTable from '../components/listingsTable';
const ApiHandler = require('../../scripts/apiHandler');
import ApiError from '../../scripts/errors/apiError'

// const formFields = {}

export default function HomePage() {

    return (
        <>
            <Head>
                <title>Bazaar Listings Scanner</title>
            </Head>

            <div>
                <form id="search-bazaar-form">
                    <TextField name="api-field" label="API Key"/>
                    <TextField name='item-field' label="Enter Item" />
                    <TextField name='num-results-field' type="number" label="Number of Results" defaultValue='10' inputProps={{min: '1'}}/>
                    <Button name='search-button' onClick={onClickHandler} variant="contained" color="primary">Search</Button>
                </form>
                <br />
                <Divider/>
                <ListingsTable />
            </div>
        </>
    )
}

async function onClickHandler() {
    // if (validForm()) { //TODO: validate form data
        try {
            let itemId = await ApiHandler.getItemId('xanax', 'oWCYcYDXgqhiQGeX');

            // TODO: Valid id?

            ApiHandler.getJson(processListings, {key:'oWCYcYDXgqhiQGeX', category:'market', id: itemId, selections:'bazaar', hasField:true});
        } catch (error) {
            console.error('Error occurred while processing search:');
            console.error(error)
        }
    // }
    // else
    //     highlightErrors();
}

function processListings(json) {
    console.log(json);
    let numResults = 10; //TODO: get the number of results to fetch.

    let listings = json.slice(0, numResults);
    
}