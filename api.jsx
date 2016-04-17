import qs from 'qs';

const { 
	MESSAGES_WEBSOCKET_SERVICE_HOST = "localhost", 
	MESSAGES_WEBSOCKET_SERVICE_PORT = "80",
	MESSAGES_REST_SERVICE_HOST = "localhost", 
	MESSAGES_REST_SERVICE_PORT = "80"
} = process.env;

const baseURL = "http://" + MESSAGES_REST_SERVICE_HOST + ":" + MESSAGES_REST_SERVICE_PORT;

export const api = (options = {}) => {
	const { endpoint, method = "GET", query, body } = options;
	
	const queryString = qs.stringify(query);
	
	let fetchArguments = {
		method,
		headers: {}
	};
	
	if(body) {
		fetchArguments.body = JSON.stringify(body);
		fetchArguments.headers["Content-type"] = "application/json";
	}
	
	return new Promise((resolve, reject) => {
		fetch(baseURL + endpoint + (queryString ? "?" + queryString : ""), fetchArguments).then(response => {
			response.json().then(resolve, reject);
		}).catch(reject);
	});
};

export const postConversation = (participants) => {
	return api({
		method: "POST",
		endpoint: "/conversations",
		body: {
			participants
		}
	});
};

export const getConversations = (name) =>  {
	return api({
		endpoint: "/conversations",
		query: {
			name
		}
	});
};

export const getBuckets = (conversationId, limit, sequence) =>  {
	return api({
		endpoint: "/buckets",
		query: {
			conversationId, limit, sequence
		}
	});
};

export const postMessage = (message) =>  {
	return api({
		method: "POST",
		endpoint: "/messages",
		body: message
	});
};
