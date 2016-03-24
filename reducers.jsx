import { combineReducers } from 'redux';

function conversations(state = {}, action) {
			
	const { name } = action;
			
	switch (action.type) {
		case "ADD_MESSAGE":
			const { text, incoming } = action;
			const messages = state[name] || [];
			
			return {
				...state,
				[name]: [...messages, {
					text, incoming
				}]
			}
			
		case "CREATE_CONVERSATION":
			if(state[name])
				return state;
				
			return {
				...state,
				[name]: []
			}
			
		default:
			return state;
	}
}

function conversationOrder(state = [], action) {
	const { name } = action;
	
	switch(action.type) {
		case "ADD_MESSAGE":
		case "CREATE_CONVERSATION":
			if(state[0] === name)
				return state;
			else 
				return [name, ...state.filter(otherName => otherName !== name)];
				
		default:
			return state;
	}
}

function activeConversation(state = null, action) {
	switch(action.type) {
		case "SET_ACTIVE_CONVERSATION":
			return action.name;
			
		default:
			return state;
	}
}

function user(state = {}, action) {
	switch (action.type) {
		case "SET_USER":
			const { name, socket } = action;
			
			return {
				...state,
				name, socket
			};
	
		default:
			return state;
	}
}

export default combineReducers({
	conversations,
	conversationOrder,
	activeConversation,
	user
});