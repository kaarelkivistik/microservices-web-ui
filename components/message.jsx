import React from 'react';

import Paper from 'material-ui/lib/paper';
import Avatar from 'material-ui/lib/avatar';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import CommunicationChatBubble from 'material-ui/lib/svg-icons/communication/chat-bubble';

const messageStyle = {};

export default function Message(props) {
	const { text, incoming } = props;
	
	return (
		<div style={{textAlign: incoming ? 'right' : 'left', marginBottom: 10}}>
			{text}
		</div>
	);
};