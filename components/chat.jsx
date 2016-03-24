import React, {Component} from 'react';

import Paper from 'material-ui/lib/paper';
import Avatar from 'material-ui/lib/avatar';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import CommunicationChatBubble from 'material-ui/lib/svg-icons/communication/chat-bubble';
import TextField from 'material-ui/lib/text-field';

import Message from './message.jsx';

const chatStyle = {
	padding: 15
};

const jumbotronStyle = {
	padding: 100,
	textAlign: "center",
	fontSize: 30,
	color: "#DDD",
	textTransform: "uppercase"
};

const noMessages = <div style={jumbotronStyle}>No messages</div>;

class Chat extends Component {
	render() {
		const { conversation, partner, sendMessage } = this.props;
		
		const messages = conversation.map((message, index) => <Message {...message} key={index}/>);
		
		return (
			<Paper style={chatStyle}>
				{messages.length > 0 ? messages : noMessages}
				
				<Divider style={{marginLeft: -15, marginRight: -15}}/>
				
				<MessageBox partner={partner} sendMessage={sendMessage}/>
			</Paper>
		);
	}
}

class MessageBox extends Component {
	constructor(props) {
		super(props);
		
		this.onChange = this.onChange.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		
		this.state = {
			text: ""
		};
	}
	
	onChange(event) {
		this.setState({
			text: event.target.value
		});
	}
	
	onKeyDown(event) {
		if(event.keyCode == 13) {
			const { partner, sendMessage } = this.props;
			const { text } = this.state;
			
			sendMessage(partner, text);
			
			this.setState({
				text: ""
			});
		}
	}
	
	render() {
		const { text } = this.state;
		
		return (
			<TextField ref="text" value={text} underlineShow={false} hintText="Type a message.." onKeyDown={this.onKeyDown} onChange={this.onChange} fullWidth/>
		);
	}
}

export default Chat;