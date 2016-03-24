import React from 'react';
import ReactDOM, { render } from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import Application from './components/app.jsx';

import reducer from './reducers.jsx';
import { signIn, sendMessage } from './actions.jsx';

injectTapEventPlugin();

let store = createStore(
	reducer,
	applyMiddleware(
		thunk,
		createLogger({})
	)
);

const { dispatch, getState } = store;

window.dispatch = dispatch;
window.getState = getState;
window.signIn = signIn;
window.sendMessage = sendMessage;

render(<Provider store={store}><Application/></Provider>, document.querySelector("#app"));