// const electron = require('electron');
// const path = require('path');
// const fs = require('fs');

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
});
export const priceFormatter = CURRENCY_FORMATTER.format;

export function toTitleCase(string: string) {
    return string.toLowerCase().split(/^|\s/).map(x => x ? x[0].toUpperCase() + x.slice(1) : x).join(' ');
};

// export class SettingsManager {
//     constructor() {
//         this.CONFIG_NAME = 'config.json';
//         this.LOCATION = 'userData';

//         try {
//             this.cwd = (electron.app || electron.remote.app).getPath(this.LOCATION);
//             this.filePath = path.join(this.cwd, this.CONFIG_NAME);
//         } catch (error) {
//             console.error('Error initialising SettingsManager.', error);
//         }
//     }

//     readConfig() {
//         try {
//             if (!this.cwd || !this.filePath) {
//                 this.cwd = (electron.app || electron.remote.app).getPath(this.LOCATION);
//                 this.filePath = path.join(this.cwd, this.CONFIG_NAME);
//             }
//             return JSON.parse(fs.readFileSync(this.filePath));
//         } catch (error) {
//             if (error.code === 'ENOENT')
//                 console.debug('No config data found');
//             else
//                 console.error('Error reading config.', error);
//         }
//     }

//     async storeConfig(data) {
//         if (!this.cwd || !this.filePath) {
//             this.cwd = (electron.app || electron.remote.app).getPath(this.LOCATION);
//             this.filePath = path.join(this.cwd, this.CONFIG_NAME);
//         }
//         fs.writeFile(this.filePath, JSON.stringify(data, null, 3), function (err, result) {
//             if (err) console.error('Error saving data:', err);
//         });
//     }
// }