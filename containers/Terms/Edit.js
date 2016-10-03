import React, { Component } from 'react'
import { ScrollView, View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { values, isEmpty } from 'lodash'
import PropTypes from '../../PropTypes'
import { updateTerm } from '../../actions'
import SchemaFormField from '../../components/General/SchemaFormField'

export default class Edit extends Component {
	static navigatorButtons = {
		rightButtons: [
			{
				title: 'Save',
				id: 'save'
			}
		]
	}
	constructor(props) {
		super(props)
		this.state = {
			term: {...props.taxonomies[ this.props.taxonomy ].terms[ this.props.term ] }
		}
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
	}
	onNavigatorEvent() {
		this.onSave()
	}
	onChangePropertyValue( property, value ) {
		var term = this.state.term
		term[ property ] = value
		this.setState({term})
	}
	onSave() {
		this.props.dispatch( updateTerm( this.state.term ) )
		this.props.navigator.pop()
	}
	render() {
		const taxonomy = this.props.taxonomies[ this.props.taxonomy ]
		const slug = taxonomy._links['wp:items'][0].href.split( '/' ).slice(-1)[0]
		var schema = this.props.sites[ this.props.activeSite.id ].routes[ '/wp/v2/' + slug ].schema
		var object = this.state.term

		var namesMap = {
			name: 'Name',
			slug: 'Slug',
			description: 'Description',
		}

		return (
			<ScrollView>
				<View style={styles.list}>
					{Object.entries( schema.properties ).map( properties => {
						const propertySchema = properties[1]
						const property = properties[0]
						const value = object[ property ]

						if ( typeof value === 'undefined' ) {
							console.log( 'Can not find schema property ' + property + ' in object.' )
							return null
						}

						if ( propertySchema.readonly ) {
							return null;
						}

						return <View style={styles.listItem} key={property}>
							<SchemaFormField
								name={namesMap[ property ] ? namesMap[ property ] : property}
								schema={propertySchema}
								value={value}
								onChange={ value => this.onChangePropertyValue( property, value ) }
								onSave={()=>{}}
							/>
						</View>
					})}
				</View>
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	list: {
		paddingTop: 15,
	}
})
