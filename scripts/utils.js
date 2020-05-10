'use strict'

const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    });

export function priceFormatter(price) {
    return formatter.format(price);
};