import * as React from 'react'
import { ScrollView, TouchableOpacity, Text } from 'react-native'

import { routeNames } from '../App'

class Menu extends React.Component {

  renderItem = (routeName, i) => {
    return (
      <TouchableOpacity 
        key={`item-${routeName}-${i}`}
        onPress={() => this.props.navigation.navigate(routeName)}
        style={{ 
          backgroundColor: '#666', 
          width: '50%', 
          height: 60,
          borderRadius: 5, 
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: 10,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24}}>{routeName}</Text>
        </TouchableOpacity>
    )
  }

  render() {
    console.log('render!')
    return (
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center'
        }}
      >
      {routeNames.map(this.renderItem)}
      </ScrollView>
    )
  }
}

export default Menu