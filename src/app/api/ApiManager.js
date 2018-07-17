import React from 'react'
import {Range, RANGE_1D, RANGE_1M, RANGE_1W, RANGE_1Y, RANGE_3M, RANGE_6M, RANGE_MAX} from "../redux/Chart";

const API = 'https://min-api.cryptocompare.com';

export class ApiManager {
    static getAllCoins(handler) {
        return fetch('https://api.coinmarketcap.com/v1/ticker')
            .then((response) => response.json())
            .then((responseJson) => {
                handler(responseJson)
            })
            .catch((error) => {
                console.error(error);
            });
    }

    static getImages(handler) {
        return fetch('https://www.cryptocompare.com/api/data/coinlist').then((response) => response.json())
            .then((responseJson) => {
                handler(responseJson)
            })
            .catch((error) => {
                console.error(error);
            });
    }

    static getForUrl(url, handler) {
        var URL = `${API}/${url}`
        console.log(`URL: ${URL}`)
        return fetch(URL).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                handler(responseJson)
            })
            .catch((error) => {
                console.error(error);
            });
    };

    static getDataChart(coinKey: string, range: Range, handler){
        var url = buildAPIQuery(coinKey, range)
        this.getForUrl(url, handler)
    }
}

const buildAPIQuery = (symbol: string, range: Range): string => {

    let endpoint = 'histohour';
    let aggregate = 1;
    let limit = 24;

    switch (range) {
        case RANGE_1D:
            endpoint = 'histohour';
            aggregate = 1;
            limit = 24;
            break;
        case RANGE_1W:
            endpoint = 'histoday';
            aggregate = 1;
            limit = 7;
            break;
        case RANGE_1M:
            endpoint = 'histoday';
            aggregate = 1;
            limit = 30;
            break;
        case RANGE_3M:
            endpoint = 'histoday';
            aggregate = 3;
            limit = 30;
            break;
        case RANGE_6M:
            endpoint = 'histoday';
            aggregate = 6;
            limit = 30;
            break;
        case RANGE_1Y:
            endpoint = 'histoday';
            aggregate = 12;
            limit = 30;
            break;
        case RANGE_MAX:
            endpoint = 'histoday';
            aggregate = 200;
            limit = 2000; // maximum allowed limit
            break;
    }

    return `data/${endpoint}?fsym=${symbol}&tsym=USD&aggregate=${aggregate}&limit=${limit}`;
};

module.exports = ApiManager;
