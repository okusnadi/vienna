import React, { Component } from 'react';
import {
	ScrollView,
	Image,
	RefreshControl,
	TouchableOpacity,
	Modal,
	View,
	Text,
} from 'react-native';
import { connect } from 'react-redux';
import { values, isEmpty } from 'lodash';
import { fetchUsers } from '../../actions';
import PropTypes from '../../PropTypes';
import ListItem from '../../components/Users/ListItem';
import EditItem from './Edit';
import ListError from '../../components/General/ListError';
import NavigationButton from '../../components/Navigation/Button';

class List extends Component {
	static navigationOptions = ({ navigationOptions, navigation }) => ({
		title: 'Users',
		headerRight: (
			<NavigationButton
				onPress={() => {
					navigation.navigate('UsersAdd');
				}}
			>
				Add New
			</NavigationButton>
		),
	});
	constructor(props) {
		super(props);
		this.state = {
			editingUser: null,
		};
	}
	componentWillMount() {
		if (isEmpty(this.props.users.users)) {
			this.props.dispatch(fetchUsers({ per_page: 100 }));
		}
	}
	onSelectUser(user) {
		this.props.navigator.push({
			screen: 'UsersEdit',
			passProps: {
				user: user.id,
			},
			title: user.name,
		});
	}
	onRefresh() {
		this.props.dispatch(fetchUsers({ per_page: 100 }));
	}
	render() {
		return (
			<View style={{ flex: 1 }}>
				{this.props.users.list.lastError
					? <ListError error={this.props.users.list.lastError} />
					: null}
				<ScrollView
					refreshControl={
						<RefreshControl
							refreshing={this.props.users.list.loading}
							style={{ backgroundColor: 'transparent' }}
							onRefresh={this.onRefresh.bind(this)}
							tintColor="#666666"
							title={
								this.props.users.list.loading
									? 'Loading Users...'
									: 'Pull to Refresh...'
							}
							titleColor="#000000"
						/>
					}
				>
					{values(this.props.users.users).map(user => {
						return (
							<TouchableOpacity
								key={user.id}
								onPress={this.onSelectUser.bind(this, user)}
							>
								<ListItem
									user={user}
									onEdit={this.onSelectUser.bind(this, user)}
									onTrash={() => {}}
								/>
							</TouchableOpacity>
						);
					})}
				</ScrollView>
			</View>
		);
	}
}

export default connect(state => ({
	...state,
	...(state.activeSite.id ? state.sites[state.activeSite.id].data : null),
}))(List);
