const defaultState = {
	users: {},
	schema: null,
	available: true,
	list: {
		loading: false,
	},
}
export default function users( state = defaultState, action ) {
	switch ( action.type ) {
		case 'SITE_DATA_UPDATED':
			return {
				...state,
				schema: action.data.routes['/wp/v2/users'].schema
			}
		case 'USERS_UPDATING':
			state.list.loading = true
			return {...state}
		case 'USERS_UPDATED':
			action.data.forEach( user => {
				state.users[ user.id ] = user
			})
			state.list.loading = false
			return {...state}
		case 'USERS_USER_UPDATED':
			state.users[ action.payload.user.id ] = action.payload.user
			return {...state}
	}
	return state
}
