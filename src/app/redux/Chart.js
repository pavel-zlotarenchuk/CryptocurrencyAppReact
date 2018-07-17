import type {Store} from './Index';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

export const RANGE_1D = '1D';
export const RANGE_1W = '1W';
export const RANGE_1M = '1M';
export const RANGE_3M = '3M';
export const RANGE_6M = '6M';
export const RANGE_1Y = '1Y';
export const RANGE_MAX = 'MAX';
export const RANGES = [RANGE_1D, RANGE_1W, RANGE_1M, RANGE_3M, RANGE_6M, RANGE_1Y, RANGE_MAX];

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type Range = typeof RANGE_1D
    | typeof RANGE_1W
    | typeof RANGE_1M
    | typeof RANGE_3M
    | typeof RANGE_6M
    | typeof RANGE_1Y
    | typeof RANGE_MAX;

export type State = {
    +loading: boolean,      // activity indicator flag
    +range: Range,          // current date range
    +prices: Array<number>, // historical prices
};

type Action =
    | { type: 'LOADING_CHART_PRICES' }
    | { type: 'SELECTED_CHART_RANGE', range: Range }
    | {
    type: 'UPDATED_CHART_PRICES',
    response: {
        Data: Array<{
            close: number,
            high: number,
            low: number,
            open: number,
            time: number,
            volumefrom: number,
            volumeto: number,
        }>,
        TimeFrom: number,
        TimeTo: number,
    }
};

type GetState = () => Store;
type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;

// -----------------------------------------------------------------------------
// Initial state
// -----------------------------------------------------------------------------

const initialState: State = {
    loading: true,  // show activity indicator on first load
    range: '1D',    // default to one day range
    prices: [],     // no price data initially
};

// -----------------------------------------------------------------------------
// Reducer
// -----------------------------------------------------------------------------

export default function reducer(state: State = initialState, action: Action) {
    switch (action.type) {

        case 'LOADING_CHART_PRICES': {
            return {
                ...state,
                loading: true,
            };
        }

        case 'UPDATED_CHART_PRICES': {
            const {response: {Data}} = action;
            return {
                ...state,
                loading: false,
                prices: !!Data ? Data.map(item => item.close) : [] // use closing prices
            };
        }

        case 'SELECTED_CHART_RANGE': {
            const {range} = action;
            return {
                ...state,
                range,
            };
        }

        default: {
            return state;
        }
    }
}
