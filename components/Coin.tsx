import * as React from 'react'

import { ART, Animated, View } from 'react-native'

const { Surface, Group, Shape } = ART;
const AnimatedShape = Animated.createAnimatedComponent(Shape);

const batman = 'M 256,213 C 245,181 206,187 234,262 147,181 169,71.2 233,18   220,56   235,81   283,88   285,78.7 286,69.3 288,60   289,61.3 290,62.7 291,64   291,64   297,63   300,63   303,63   309,64   309,64   310,62.7 311,61.3 312,60   314,69.3 315,78.7 317,88   365,82   380,56   367,18   431,71   453,181 366,262 394,187 356,181 344,213 328,185 309,184 300,284 291,184 272,185 256,213 Z'     


class Coin extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, bakcgroundColor: 'tomato' }}>
        <Surface
          width={400}
          height={400}
        >
          <Group x={0} y={0}>

            <AnimatedShape
              d={batman}
              stroke="#ff0000"
              strokeWidth={10}
            />
          </Group>
        </Surface>
      </View>
    )
  }
}

export default Coin