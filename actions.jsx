import qs from 'qs';

import { postConversation, getConversations, getBuckets, postMessage } from './api.jsx';

const { 
	MESSAGES_WEBSOCKET_SERVICE_HOST = "localhost", 
	MESSAGES_WEBSOCKET_SERVICE_PORT = "80"
} = process.env;

/* Async actions */

export const signIn = (name) =>  {
	return dispatch => {
		const socket = new WebSocket("ws://" + MESSAGES_WEBSOCKET_SERVICE_HOST + ":" + MESSAGES_WEBSOCKET_SERVICE_PORT + "/?name=" + name);
		
		socket.onclose = () => {
			dispatch(setUser());	
		};
		
		socket.onmessage = event => {
			const decoded = JSON.parse(event.data);
			const { type } = decoded;
			
			switch(type) {
				case "MESSAGE_SENT":
					const { message: { from, text } } = decoded;
					
					dispatch(addMessage(from, text, true));
					
					break;
					
				case "CONVERSATION_CREATED":
					const { conversation: { id, participants }} = decoded;
					
					dispatch(addConversations([{
						_id: id,
						participants
					}]));	
			}
			
		};
		
		dispatch(setUser(name, socket));
		dispatch(fetchConversations());
	};
};

export const createConversation = partner =>  {
	return (dispatch, getState) => {
		const { user: { name, socket } } = getState();
		
		postConversation([name, partner]).then(conversation => {
			const { id, participants } = conversation;
			
			dispatch(addConversations([{
				_id: id, 
				participants
			}]));
			
			socket.send(JSON.stringify({
				type: "CONVERSATION_CREATED",
				conversation: {
					id, participants
				}
			}));
			
			console.log(conversation);
		});
	};
};

export const fetchConversations = () => {
	return (dispatch, getState) => {
		const { user: { name } } = getState();
		
		getConversations(name).then(conversations => {
			dispatch(addConversations(conversations));
		});
	};
};

export const fetchBuckets = (partner, conversationId) => {
	return (dispatch, getState) => {
		const { user: { name }, conversations } = getState();
		
		// const { buckets } = conversations[partner];
		
		getBuckets(conversationId, 2).then(buckets => {
			dispatch(addBuckets(partner, buckets));
		});
	};
};

export const sendMessage = (to, text) =>  {
	return (dispatch, getState) => {
		const { user, conversations } = getState();
		const { socket } = user;
		
		const { id: conversationId } = conversations[to];
		
		socket.send(JSON.stringify({
			type: "MESSAGE_SENT", 
			message: {
				conversationId, to, text
			}
		}));
		
		dispatch(addMessage(to, text, false));
	};
};

/* Regular actions */

export const setUser = (name, socket) =>  {
	return {
		type: "SET_USER",
		name, socket
	};
};

export const setActiveConversation = (name) =>  {
	return {
		type: "SET_ACTIVE_CONVERSATION",
		name
	};
};

/*export const createConversation = partner =>  {
	return {
		type: "CREATE_CONVERSATION",
		partner
	};
};*/

export const addConversations = conversations => {
	return {
		type: "ADD_CONVERSATIONS",
		conversations
	};
};

export const addMessage = (partner, text, incoming, timestamp) =>  {
	return {
		type: "ADD_MESSAGE",
		partner, text, incoming, timestamp
	};
};

export const addBuckets = (partner, buckets) =>  {
	return {
		type: "ADD_BUCKETS",
		partner, buckets	
	};
};

