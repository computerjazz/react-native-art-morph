import * as React from 'react'
import { View } from 'react-native'
import FaceSlider from './components/FaceSlider'
import {createStackNavigator, createAppContainer} from 'react-navigation'

import Menu from './screens/Menu'

export const routeNames = ['Face']

const Stack = createStackNavigator({
  Menu: { screen: Menu },
  Face: { screen: FaceSlider },
}, {
  initialRoutName: 'Menu',
})

const Navigator = createAppContainer(Stack)


class App extends React.Component {
  state = {
    hide: true,
  }



  render() {
    return ( 
      <View 
        onLayout={() => {
          // For some reason this is necessary on android
          // or else ART Surface renders a black screen
        }}
        style={{ flex: 1 }}
        >
        <Navigator persistenceKey="appNav" />
      </View>
    )
  }
}

export default App