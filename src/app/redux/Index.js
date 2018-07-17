import {combineReducers} from 'redux';
// import types
import type {State as Chart} from './Chart';
// import reducers
import chart from './Chart';
import type {State as Coins} from './Coins';
import coins from './Coins';

export type Store = {
    +chart: Chart,
    +coins: Coins,
};

export default combineReducers({
    chart,
    coins,
});
