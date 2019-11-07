import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'

const rootReducer = combineReducers(reducers)
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const configureRedux = () => {
    if (process.env.NODE_ENV === 'development') return createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))
    return createStore(rootReducer, applyMiddleware(thunk))
}

export default configureRedux()