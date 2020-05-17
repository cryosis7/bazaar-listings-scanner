import HttpError from './errors/httpError';
import { ApiError } from 'next/dist/next-server/server/api-utils';
import { ERROR_MESSAGES } from './constants'

'use strict'

const allItems = {};

/**
 * Attempts to retrieve json from Torns API then process the results in the callback passed to it.
 * If it is invalid it will throw an HttpError or ApiError (Depending on where the error was in the process).
 * @param {string} key
 * @param {string} category 
 * @param {string} selections 
 * @param {string} id 
 * @param {boolean} hasField Some of the api results are within an object field of the selection name
 */
export function getJson(callback, { key = '', category = '', id = '', selections = '', hasField = false } = {}) {
    let url = `https://api.torn.com/${category}/${id}?selections=${selections}&key=${key}`;

    return fetch(url)
        .then(response => {
            if (!response.ok)
                throw new HttpError(response.statusText, response.status);
            return response.json();
        })
        .then(json => {
            if (json.error !== undefined)
                throw new ApiError(json.error.code, ERROR_MESSAGES[json.error.code]);
            callback(hasField ? json[selections] : json)
        })
        .catch(err => {
            console.error(err.name + ' while fetching results from Torn: ' + err.message + ' - ' + err.code)
            console.error(err)
            throw err;
        })
}

/**
 * Returns the matching items id and proper name if exists.
 * @param {String} itemName
 * @param {String} apiKey 
 */
export async function getItem(itemName, apiKey) {
    if (itemName) {
        if (!Object.keys(allItems).length)
            await fillItemList(apiKey);

        let sanitisedName = itemName.toLowerCase().trim();
        for (let [item, itemData] of Object.entries(allItems))
            if (item.includes(sanitisedName))
                return itemData;
    }
}

/**
 * Fills the item list with all items.
 * @param {String} apiKey 
 */
async function fillItemList(apiKey) {
    await getJson((jsonItems) => {
        for (let id in jsonItems)
            allItems[jsonItems[id].name.toLowerCase().trim()] = { id: id, properName: jsonItems[id].name };
    }, { key: apiKey, category: 'torn', selections: 'items', hasField: true });
}