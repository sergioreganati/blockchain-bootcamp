import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { provider, tokens, exchange } from './reducer';

const reducers = combineReducers({
    provider,
    tokens,
    exchange
});



const initialState = {};

const middleware = [thunk];

const store = createStore(
    reducers, initialState, composeWithDevTools(applyMiddleware(...middleware))
)

export default store;
