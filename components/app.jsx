import React, {Component} from 'react';
import { connect } from 'react-redux';

import Paper from 'material-ui/lib/paper';

import { signIn, createConversation, setActiveConversation } from '../actions.jsx';

import Conversations from './conversations.jsx';
import Chat from './chat.jsx';
import Header from './header.jsx';

const containerStyle = {
	padding: 20
};

const jumbotronStyle = {
	padding: 100,
	textAlign: "center",
	fontSize: 30,
	color: "#DDD",
	textTransform: "uppercase"
};

const noConversationPaper = (
	<Paper style={jumbotronStyle}>
		Start a conversation
	</Paper>
);

class Application extends Component {
	
	render() {
		const { user, conversations, conversationOrder, activeConversation, dispatch } = this.props;
		const { name: activeUserName } = user;
		
		return (
			<div style={containerStyle}>
				<div className="row">
					<div className="col-xs-12">
						<Header user={user} signIn={name => {
							dispatch(signIn(name));
							
							if(conversationOrder.length > 0)
								dispatch(setActiveConversation(conversationOrder[0]));
						}}/>
					</div>
				</div>
				
				{activeUserName ? null : <div className="row">
					<div className="col-xs-12">
						<Paper style={jumbotronStyle}>
							Not signed in
						</Paper>
					</div>
				</div>}
				
				{activeUserName ? <div className="row">
					<div className="col-xs-12 col-sm-4 col-md-3">
						<Conversations 
							conversations={conversations}
							conversationOrder={conversationOrder}
							activeConversation={activeConversation} 
							setActiveConversation={name => {
								dispatch(setActiveConversation(name));
							}} createConversation={name => {
								dispatch(createConversation(name));
								dispatch(setActiveConversation(name));
							}}/>
					</div>
					<div className="col-xs-12 col-sm-8 col-md-9">
						{Object.keys(conversations).filter(name => name == activeConversation).map(name => (
								<Chat key={name} 
									conversation={conversations[name]}
									partner={activeConversation}
									sendMessage={(name, text) => {
										dispatch(sendMessage(name, text));
									}}/>
							)
						).shift() || noConversationPaper}
					</div>
				</div> : null}
			</div>
		);
	}
}

export default connect(state => state)(Application);