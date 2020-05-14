'use strict'

const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    });

export function priceFormatter(price) {
    return formatter.format(price);
};

export function toTitleCase(string) {
    return string.toLowerCase().split(/^|\s/).map(x => x ? x[0].toUpperCase() + x.slice(1) : x).join(' ');
};