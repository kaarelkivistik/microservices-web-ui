import React, {Component} from 'react';
import { connect } from 'react-redux';

import { teal50 } from 'material-ui/lib/styles/colors';

import FontIcon from 'material-ui/lib/font-icon';
import TextField from 'material-ui/lib/text-field';
import Paper from 'material-ui/lib/paper';
import Avatar from 'material-ui/lib/avatar';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import FlatButton from 'material-ui/lib/flat-button';

import { fetchBuckets, setActiveConversation, createConversation } from '../actions.jsx';

const newIcon = <FontIcon className="material-icons">home</FontIcon>;

const newConversationTextFieldStyle = {
	padding: "0px 16px 5px 16px"
};

export default connect(state => state, {
	fetchBuckets, 
	setActiveConversation, 
	createConversation
})(function Conversations(props) {
	const { conversations, conversationOrder, activeConversation, fetchBuckets, setActiveConversation, createConversation } = props;
	
	const numberOfConversations = conversationOrder.length;
	
	return (
		<Paper zDepth={1}>
			<List>
				<ListItem disabled style={newConversationTextFieldStyle}>
					<NewConversationBox 
						createConversation={createConversation} 
						setActiveConversation={setActiveConversation}/>
				</ListItem>
				<Divider/>
				
				{numberOfConversations == 0 ? <ListItem style={{textAlign: "center"}} disabled><FlatButton disabled label="You have no conversations"/></ListItem> : null}
				
				{conversationOrder.map(name => {
					const conversation = conversations[name];
					const { id, lastMessage } = conversation;
					
					return (
						<ListItem
							key={name}
							onClick={(name => {
								fetchBuckets(name, id);
								setActiveConversation(name);
							}).bind(this, name)}
							leftAvatar={<Avatar>{name[0].toUpperCase()}</Avatar>}
							primaryText={name}
							secondaryText={lastMessage ? lastMessage.text : undefined}
							style={{backgroundColor: activeConversation === name ? teal50 : 'white'}} />
					);
				})}
			</List>
		</Paper>
	);
});

class NewConversationBox extends Component {
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
			name: event.target.value
		});
	}
	
	onKeyDown(event) {
		if(event.keyCode == 13) {
			const { createConversation, setActiveConversation } = this.props;
			const { name } = this.state;
			
			createConversation(name);
			setActiveConversation(name);
			
			this.setState({
				name: ""
			});
		}
	}
	
	render() {
		const { name } = this.state;
		
		return (
			<TextField value={name} underlineShow={false} hintText="Type a persons name.." onKeyDown={this.onKeyDown} onChange={this.onChange} fullWidth/>
		);
	}
}