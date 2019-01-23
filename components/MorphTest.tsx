import * as React from 'react';
import { Animated, StyleSheet, View, PanResponder, Dimensions } from 'react-native';
import { ART } from 'react-native'

const {
  Surface,
  Shape,
  Group,
} = ART

console.log('ART', ART)

const AnimatedShape = Animated.createAnimatedComponent(Shape);


class MorphTest extends React.Component {

  render() {
    return (

          <Surface
            width={400}
            height={400}
          >
            <Group x={0} y={0}>

              <AnimatedShape
                d="M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80"
                stroke="#ff0000"
                strokeWidth={10}
              />
            </Group>
          </Surface>
    )
  }
}

export default MorphTest