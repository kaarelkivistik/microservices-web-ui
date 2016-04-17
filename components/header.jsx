import React from 'react';
import { connect } from 'react-redux';

import Paper from 'material-ui/lib/paper';
import Avatar from 'material-ui/lib/avatar';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import CommunicationChatBubble from 'material-ui/lib/svg-icons/communication/chat-bubble';
import TextField from 'material-ui/lib/text-field';
import FlatButton from 'material-ui/lib/flat-button';

import { signIn } from '../actions.jsx';

const headerStyle = {
	paddingLeft: 20,
	paddingRight: 20,
	paddingTop: 10,
	paddingBottom: 10,
	marginBottom: 20
};

const rowStyle = {
	height: 60
};

const brandStyle = { 
	fontFamily: "Roboto",
	fontWeight: 100,
	fontSize: 25,
	letterSpacing: 7,
	color: "#555",
	textTransform: "uppercase"
};

export default connect(state => state.user, {signIn})(function Header(props) {
	const { name, signIn } = props;
	
	return (
		<Paper style={headerStyle}>
			<div className="row middle-xs" style={rowStyle}>
				<div className="col-md-10" style={brandStyle}>Yet Another Instant Messenger</div>
				<div className="col-md-2" style={{textAlign: "right"}}>
					{name ? <FlatButton onClick={event => {
						
					}} label={name}/> : <TextField hintText="Name" onKeyDown={event => {
						if(event.keyCode == 13) {
							signIn(event.target.value);
						}
					}}/>}
				</div>
			</div>
		</Paper>
	);
});