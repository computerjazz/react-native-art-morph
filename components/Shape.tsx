import * as React from 'react'
import { Animated, ART, Dimensions, View, PanResponder } from 'react-native'

import { PanGestureHandler } from 'react-native-gesture-handler'
import { Svg } from 'expo'
const { width } = Dimensions.get('window')

const {
  Surface,
  Group,
  Shape,
} = ART

import Morph from 'art/morph/path';
import SvgPath from 'art/modes/svg/path';

import * as axis from "d3-axis"; // tslint:disable-line
import * as format from "d3-format"; // tslint:disable-line
import * as scale from "d3-scale"; // tslint:disable-line
import * as shape from "d3-shape"; // tslint:disable-line

const d3 = {
  scale,
  shape,
  format,
  axis,
};

const AnimatedShape = Animated.createAnimatedComponent(Shape);
const AnimatedSvgPath = Animated.createAnimatedComponent(Svg.Path)

const batman = 'M 256,213 C 245,181 206,187 234,262 147,181 169,71.2 233,18   220,56   235,81   283,88   285,78.7 286,69.3 288,60   289,61.3 290,62.7 291,64   291,64   297,63   300,63   303,63   309,64   309,64   310,62.7 311,61.3 312,60   314,69.3 315,78.7 317,88   365,82   380,56   367,18   431,71   453,181 366,262 394,187 356,181 344,213 328,185 309,184 300,284 291,184 272,185 256,213 Z'     

const makeArea = d3.shape.area()
  .x(d => d.x)
  .y0(d => d.y0)
  .y1(d => d.y1)

var points = [
  [0, 80],
  [Math.PI * 0.25, 80],
  [Math.PI * 0.5, 30],
  [Math.PI * 0.75, 80],
  [Math.PI, 80],
  [Math.PI * 1.25, 80],
  [Math.PI * 1.5, 80],
  [Math.PI * 1.75, 80],
  [Math.PI * 2, 80]
];

var arcGenerator = d3.shape.arc()
  .innerRadius(20)
  .outerRadius(100)
  .padAngle(.02)
  .padRadius(200)
  .cornerRadius(4);

var arcData = [
  { startAngle: 0, endAngle: 0.2 },
  { startAngle: 0.2, endAngle: 0.6 },
  { startAngle: 0.6, endAngle: 1.4 },
  { startAngle: 1.4, endAngle: 3 },
  { startAngle: 3, endAngle: 2 * Math.PI }
];

var arcs = arcData.map(arcGenerator)
const arcAlt = arcData.map(({ startAngle, endAngle }) => ({ startAngle, endAngle: startAngle + (endAngle - startAngle) / 2 })).map(arcGenerator)
const arcMorphs = arcs.map((arc, i) => Morph.Tween(arc, arcAlt[i]))

const makeRadialLine = d3.shape.lineRadial()


const testd = [...Array(20)].map((d, i) => {
  return {
    x: Math.random() * 10,
    y: Math.random() * 5
  }
})

console.log('D3', d3)
const radialLine = makeRadialLine(points)
console.log('radioal line', radialLine)

const shapeWidth = width / 2

const dRect = [...Array(2)].map((d, i, arr) => {
  const ratio = i / (arr.length - 1)
  const height = 50
  return ({
    x: ratio * shapeWidth,
    y0: height,
    y1: 0,
  })
})

const dTri = [...Array(3)].map((d, i, arr) => {
  const ratio = i / (arr.length - 1)
  const height = 50
  return ({
    x: ratio * shapeWidth,
    y0: 0,
    y1: i * (arr.length - 1 - i) * height,
  })
})

const dPent = [...Array(5)].map((d, i, arr) => {
  const ratio = i / (arr.length - 1)
  return ({
    x: Math.sin(ratio) * shapeWidth,
    y0: Math.cos(ratio) * shapeWidth,
    y1: i * (arr.length - 1 - i) * shapeWidth,
  })
})


const pent = makeArea(dPent)
const tri = makeArea(dTri)
const rect = makeArea(dRect)

const morph = Morph.Tween(tri, rect)

class ShapeScreen extends React.Component {
  
  state = {
    morph,
    prevX: 0,
    arcPaths: arcs,
    morphPaths: arcs.map((arc, index, arr) => {
      const fromPath = arc
      const toPath = index < arr.length - 1 ? arr[index + 1] : arr[0]
      const morph = Morph.Tween(fromPath, toPath)
      return morph
    })
  }

  constructor(props) {
    super(props)
    this.responder = PanResponder.create({
      onStartShouldSetPanResponder: () => {
        return true
      },
      onPanResponderMove: (evt, gestureState) => {
        const { dx } = gestureState
        const x = (this.state.prevX + dx)
        const widthRatio = x / (width / 2)
        const ratio = Math.min(1, Math.max(0, widthRatio))
        this.state.morph.tween(ratio)
        arcMorphs.forEach(morph => morph.tween(ratio))
        this.state.morphPaths.forEach(morph => morph.tween(ratio))
        this.c.setValue(ratio)
      },
      onPanResponderRelease: (evt, { dx }) => {
        this.setState(state => ({ prevX: state.prevX + dx }))
      }
    })
  }

  componentDidMount(){
    this.c.addListener(({ value }) => {
      const nextArcs = arcData.map(({ startAngle, endAngle }) => ({ startAngle: startAngle * value, endAngle: endAngle * value })).map(arcGenerator)
      this.setState({ arcPaths: nextArcs })
      this.state.morphPaths.forEach(morph => morph.tween(value))
    })
    this.c.setValue(0)

    setTimeout(() => {
      Animated.spring(this.c, {
        toValue: 1,
        stiffness: 20,
        damping: 10,
        mass: 1,
      }).start()
    }, 500)
  }



  c = new Animated.Value(0)
  color = this.c.interpolate({
    inputRange: [0, 1],
    outputRange: ["seashell", "seashell"],
  })

  render() {
    return (
      <View 
        {...this.responder.panHandlers}
        style={{ flex: 1, backgroundColor: 'seashell', justifyContent: 'center'}}
        >
      <Svg width={width} height={width}>
        <Svg.G x={width / 2} y={width / 2} onPress={() => alert('group')}>
          {this.state.morphPaths.map((morph, index, arr) => {
            const colorMultiplier = 255 / (arr.length)
            const r = 255 - index * colorMultiplier
            const g = Math.abs(128 - index * colorMultiplier)
            const b = (index * colorMultiplier)
            const color = `rgba(${r}, ${g}, ${b}, 0.9)`
            return (
              <AnimatedSvgPath
                key={`morph-${index}`}
                d={SvgPath(morph).toString()}
                stroke={this.color}
                fill={color}
                onPress={() => alert('index' + index)}
              />
            )
          }

          )}
        </Svg.G>
      </Svg>
      </View>
    )
  }
}

export default ShapeScreen