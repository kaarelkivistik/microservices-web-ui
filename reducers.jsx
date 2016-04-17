import { combineReducers } from 'redux';
import sortBy from 'sort-by';

function conversations(state = {}, action, currentUser, randomId) {
	const { partner } = action;
	
	switch (action.type) {
		case "ADD_CONVERSATIONS":
			const { conversations } = action;
			const normalizedConversations = {};
			
			conversations.forEach(conversation => {
				const { _id, participants: [a, b], lastMessage } = conversation;
				
				const partner = a === currentUser ? b : a;
				
				normalizedConversations[partner] = {
					id: _id,
					buckets: [],
					messages: []
				}
				
				if(lastMessage) {
					const { _id: lastMessageId, from, text, timestamp } = lastMessage;
					
					normalizedConversations[partner].lastMessage = {
						id: lastMessageId,
						incoming: from === partner,
						text,
						timestamp
					};
				}
			});
			
			return {
				...state,
				...normalizedConversations
			};
		
		case "ADD_BUCKETS":
			const { buckets } = action;
			
			buckets.sort(sortBy("sequence"));
			
			const { sequence: firstSequence} = buckets[0] || {};			
			const { buckets: existingBuckets } = state[partner];
			
			const filteredBuckets = existingBuckets.filter(({sequence}) => sequence >= firstSequence);
			
			const normalizedBuckets = buckets.map(({_id, a, b, messages, sequence}) => {
				return {
					id: _id,
					messages: messages.map(({_id, from, to, text, timestamp}) => {
						return {
							id: _id,
							incoming: to === currentUser,
							text,
							timestamp
						}
					}) 
				}
			})
			
			return {
				...state,
				[partner]: {
					...state[partner],
					messages: [],
					buckets: [...filteredBuckets, ...normalizedBuckets]
				}
			};
		
		case "ADD_MESSAGE":
			const { text, incoming, timestamp } = action;
		
			const conversation = state[partner] || {
				buckets: [],
				messages: []
			};
			
			const { messages } = conversation;
			
			const message = {
				id: randomId,
				text, incoming, timestamp
			};
			
			return {
				...state,
				[partner]: {
					...conversation,
					lastMessage: message,
					messages: [...messages, message]
				}
			}
			
		case "CREATE_CONVERSATION":
			if(state[partner])
				return state;
				
			return {
				...state,
				[partner]: {
					id: randomId,
					buckets: [],
					messages: []
				}
			}
			
		default:
			return state;
	}
}

function conversationOrder(state = [], action, currentUser, conversations) {
	
	switch(action.type) {
		case "ADD_CONVERSATIONS":
			const existingKeys = Object.keys(conversations);
			
			const newKeys = action.conversations.map(conversation => {
				const { participants: [a, b] } = conversation;
				
				return a === currentUser ? b : a;
			}).filter(name => !conversations[name]);
			
			return [...newKeys, ...existingKeys];
		
		case "ADD_MESSAGE":
		case "CREATE_CONVERSATION":
			const { to, partner } = action;
			const name = to || partner;
			
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

function id(state = 0, action) {
	switch(action.type) {
		case "ADD_MESSAGE":
		case "CREATE_CONVERSATION":
			return state + 1;
			
		default:
			return state;
	}
}

export default function(state = {}, action) {
	const userState = user(state.user, action);
	const idState = id(state.id, action);
	
	const { name: currentUser } = userState;
	
	const conversationsState = conversations(state.conversations, action, currentUser, idState);
	
	const nextState = {
		conversations: conversationsState,
		conversationOrder: conversationOrder(state.conversationOrder, action, currentUser, conversationsState),
		activeConversation: activeConversation(state.activeConversation, action),
		user: userState,
		id: idState
	}
	
	return nextState
}

/*export default combineReducers({
	conversations,
	conversationOrder,
	activeConversation,
	user
});*/