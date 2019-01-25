import * as React from 'react'
import { View } from 'react-native'
import {createStackNavigator, createAppContainer} from 'react-navigation'

import Menu from './screens/Menu'
import FaceSlider from './components/FaceSlider'
import Coin from './components/Coin'
import Shape from './components/Shape'

export const routeNames = ['Face', 'Shape']

const Stack = createStackNavigator({
  Menu: { screen: Menu },
  Face: { screen: FaceSlider },
  Coin: { screen: Coin },
  Shape: { screen: Shape },
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
          // When rendering ART at the root of the app I had to
          // add an additional timeout that delayed rendering
        }}
        style={{ flex: 1 }}
        >
        <Navigator persistenceKey="appNav" />
      </View>
    )
  }
}

export default App