import { cacheEnhancer } from "redux-cache";
import thunk from "redux-thunk";
import { applyMiddleware, createStore, compose } from 'redux';
import rootReducer from './reducers';

export default (initialState = {}) =>
	createStore(
		rootReducer,
		initialState,
		compose(
			applyMiddleware([thunk]),
			cacheEnhancer({ log: true }),
			window.devToolsExtension ? window.devToolsExtension() : f => f,
		)
	);
