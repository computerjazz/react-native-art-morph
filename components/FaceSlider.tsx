import * as React from 'react'
import { Animated, Easing, Dimensions, PanResponder, View, TouchableOpacity, Text } from 'react-native'
import Face from './Face'

const { width } = Dimensions.get('window')
const intialRatio = 2 / 3
const faceWidth = width * 0.3
const activeWidth = width - faceWidth
const messages = ['Bad', 'Meh', 'Good', 'Great']

const barColor = '#ddd'
const dotHeight = faceWidth * 0.4

class FaceSlider extends React.Component {

  constructor(props) {
    super(props)
    this.responder = PanResponder.create({
      onStartShouldSetPanResponder: () => {
        return true
      },
      onPanResponderMove: (evt, gestureState) => {
        const { dx } = gestureState
        const x = (this.state.prevX + dx)
        const widthRatio = x / activeWidth
        if (widthRatio >= 0 && widthRatio <= 1) {
          this.xRatio.setValue(widthRatio)
        }
      },
      onPanResponderRelease: (evt, { dx }) => {
        this.setState(state => ({ prevX: state.prevX + dx }))
      }
    })

    this.state = {
      prevX: intialRatio * activeWidth,
    }
  }

  xRatio = new Animated.Value(intialRatio)
  translateX = this.xRatio.interpolate({
    inputRange: [0, 1],
    outputRange: [0, activeWidth],
    extrapolate: 'clamp'
  })

  renderDot = (d, i, arr) => {
    const step = 1 / (arr.length - 1)
    const inputRange = [step * (i - 1), step * i, step * (i + 1)]
    const halfDot = dotHeight / 2
    const translateY = this.xRatio.interpolate({
      inputRange,
      outputRange: [halfDot + 10, halfDot + faceWidth / 4, halfDot + 10 ],
      extrapolate: 'clamp'
    })
    const scale = this.xRatio.interpolate({
      inputRange,
      outputRange: [1, 0.25, 1],
      extrapolate: 'clamp'
    })
    return (
      <View
      key={`dot-${i}`}
      style={{
        justifyContent: 'center',
      }}
      >
      <Animated.View
        style={{
          width: dotHeight,
          height: dotHeight,
          transform: [{ scaleX: scale }, { scaleY: scale }]
        }}
      >
        <TouchableOpacity
          onPress={() => {
            const ratio = i / (arr.length - 1)
            this.setState({ prevX: ratio * activeWidth })
            Animated.timing(this.xRatio, {
              toValue: ratio,
              duration: 500,
              easing: Easing.inOut(Easing.quad),
            }).start()
          }}
          style={{
            flex: 1,
            borderRadius: faceWidth,
            backgroundColor: barColor,
          }}>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View
          style={{
            position: 'absolute',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'center',
            transform: [{ translateY }]
          }}
      >
          <Text style={{
            color: '#999',
            fontSize: 12,
            justifyContent: 'center',
          }}>{messages[i]}</Text>
      </Animated.View>
      </View>
    )
  }

  renderDots() {
    return (
      <View
        style={{
          position: 'absolute',
          width: '80%',
          flex: 1,
          height: dotHeight,
          alignSelf: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >

        {[...Array(4)].map(this.renderDot)}
      </View>
    )
  }

  renderBar() {
    return (
      <View style={{ 
        position: 'absolute', 
        height: dotHeight, 
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={{
        backgroundColor: barColor,
        height: 5,
        width: '70%'
      }} />
      </View>
    )
  }

  render() {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
      }}>
        {this.renderBar()}
        {this.renderDots()}
        <Animated.View {...this.responder.panHandlers}
          style={{
            width: faceWidth,
            transform: [
              { translateX: this.translateX }
            ]
          }}
        >
          <Face width={faceWidth} ratio={this.xRatio} />
        </Animated.View>

      </View>
    )
  }
}

export default FaceSlider