export const signUp = (name) =>  {
	return dispatch => {
		// TODO
	};
};

export const signIn = (name) =>  {
	return dispatch => {
		const socket = new WebSocket("ws://192.168.99.100:90/?name=" + name);
		
		socket.onclose = () => {
			dispatch(setUser());	
		};
		
		socket.onmessage = event => {
			const message = JSON.parse(event.data);
			const { from, text } = message;
			
			dispatch(addMessage(from, text, true));	
		};
		
		dispatch(setUser(name, socket));
	};
};

export const sendMessage = (to, text) =>  {
	return (dispatch, getState) => {
		const { user } = getState();
		const { socket } = user;
		
		socket.send(JSON.stringify({to, text}));
		
		dispatch(addMessage(to, text, false));
	};
};

export const setUser = (name, socket) =>  {
	return {
		type: 'SET_USER',
		name, socket
	};
};

export const createConversation = (name) =>  {
	return {
		type: 'CREATE_CONVERSATION',
		name
	};
};

export const setActiveConversation = (name) =>  {
	return {
		type: 'SET_ACTIVE_CONVERSATION',
		name
	};
};

export const addMessage = (name, text, incoming) =>  {
	return {
		type: 'ADD_MESSAGE',
		name, text, incoming
	};
};
