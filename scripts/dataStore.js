const electron = require('electron');
const path = require('path');
const fs = require('fs');

const CONFIG_NAME = 'config.json';

export function readData(defaults) {
    try {
        const userDataPath = electron.remote.app.getPath('userData');
        let filePath = path.join(userDataPath, CONFIG_NAME);
        return JSON.parse(fs.readFileSync(filePath));
    } catch (error) {
        return defaults
    }
}

export async function storeData(data) {
    let userDataPath = (electron.app || electron.remote.app).getPath('userData');
    let filePath = path.join(userDataPath, CONFIG_NAME);
    fs.writeFile(filePath, JSON.stringify(data, null, 3), function (err, result) {
        if (err) console.error('Error saving data', err);
    });
}