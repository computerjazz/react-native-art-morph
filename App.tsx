import * as React from 'react'
import { View } from 'react-native'
import FaceSlider from './components/FaceSlider'

class App extends React.Component {
  state = {
    hide: true,
  }

  componentDidMount() {
    setTimeout(() => this.setState({ hide: false }))
  }

  render() {
    return ( 
      <View 
        onLayout={() => console.log('for some reason this is necessary on android')}
        style={{ flex: 1 }}
        >
        {!this.state.hide && <FaceSlider />}
      </View>
    )
  }
}

export default App