import React, { Component } from 'react';
import { Animated, ART, StyleSheet, View } from 'react-native';
import { generateTweenArray, getTween } from '../utils/morphUtils'

const {
  Surface,
  Shape,
  Group,
} = ART
const AnimatedShape = Animated.createAnimatedComponent(Shape);


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

const featureColor = '#888'

export default class Face extends Component {
  xRatio = new Animated.Value(0)
  color = this.props.ratio.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#f99489', '#f9d889', '#f9d889'],
  })

  constructor(props) {
    super(props)
    const { width } = props

    const faceWidth = width
    const mouthWidth = faceWidth * 0.3
    const mouthMargin = (faceWidth - mouthWidth) / 2
    const dipAmt = mouthWidth / 5
    const numPoints = 10
    const padding = width / 10
    const refArray = [...Array(numPoints)]
    const eyeSize = width / 5

    this.faceWidth = faceWidth
    this.eyeSize = eyeSize



    const generateSmile = (mouthOpenRatio = 1) => refArray.map((d, i, arr) => {
      const xRatio = i / (arr.length - 1)
      const sinRatio = xRatio * Math.PI
      const y = Math.sin(sinRatio)
      return {
        x: xRatio,
        y0: (y * dipAmt * mouthOpenRatio) + padding,
        y1: (y * dipAmt) + padding,
      }
    })

    const generateMeh = () => refArray.map((d, i, arr) => {
      const xRatio = i / (arr.length - 1)
      return {
        x: xRatio,
        y0: dipAmt - (xRatio * dipAmt) + padding,
        y1: dipAmt - (xRatio * dipAmt) + padding,
      }
    })

    const generateFrown = (mouthOpenRatio = 1) => refArray.map((d, i, arr) => {
      const xRatio = i / (arr.length - 1)
      const sinRatio = xRatio * Math.PI
      const y = Math.sin(sinRatio)
      return {
        x: xRatio,
        y0: (dipAmt - y * dipAmt / mouthOpenRatio) + padding,
        y1: (dipAmt - y * dipAmt) + padding,
      }
    })

    const generateEye = ({ hurt, mad, open }) => refArray.map((d, i, arr) => {
      const xRatio = i / (arr.length - 1)
      const ratio = xRatio * Math.PI
      const circleMiddle = eyeSize / 2 * .75
      const pad = 5

      const madPoint = 0.25
      const madIndex = Math.floor(arr.length * madPoint)
      const madTop = Math.sin(madPoint * Math.PI) * -1 * circleMiddle + circleMiddle + pad
      const isPastMadPoint = xRatio >= madPoint

      const hurtPoint = 0.5
      const hurtIndex = Math.floor(arr.length * hurtPoint)
      const hurtTop = Math.sin(hurtPoint * Math.PI) * -1 * circleMiddle + circleMiddle + pad
      const isPastHurtPoint = xRatio >= hurtPoint

      const sinEye = Math.sin(ratio)
      const cosEye = Math.cos(ratio)

      const yMid = Math.sin(0) + circleMiddle + pad

      // console.log(`[${s}, ${c}]`)
      const x = cosEye * circleMiddle * -1 + circleMiddle + pad
      const y0 = sinEye * circleMiddle + circleMiddle + pad
      let y1 = sinEye * circleMiddle * -1 + circleMiddle + pad

      if (hurt && !isPastHurtPoint) {
        const yRange = yMid - hurtTop
        const step = yRange / hurtIndex
        const stepIndex = i - hurtIndex
        y1 = hurtTop - (stepIndex * step)
      } else if (mad && isPastMadPoint) {
        const yRange = yMid - madTop
        const step = yRange / (arr.length - madIndex)
        const stepIndex = i - madIndex
        y1 = madTop + (stepIndex * step)
      }

      return {
        x,
        y0,
        y1,
      }
    })

    const openSmileData = generateSmile(0)
    const smileData = generateSmile()
    const mehData = generateMeh()
    const frownData = generateFrown()

    const openEyeData = generateEye({ open: true })
    const hurtEyeData = generateEye({ hurt: true })
    const madEyeData = generateEye({ mad: true })

    const makeMouthArea = d3.shape.area()
      .x(d => d.x * mouthWidth + mouthMargin)
      .y0(d => d.y0)
      .y1(d => d.y1)
      .curve(d3.shape.curveCatmullRom.alpha(0.5));

    const makeEyeArea = d3.shape.area()
      .x(d => d.x)
      .y0(d => d.y0)
      .y1(d => d.y1)
      .curve(d3.shape.curveCatmullRom.alpha(0.5));

    const openSmile = makeMouthArea(openSmileData)
    const smile = makeMouthArea(smileData)
    const meh = makeMouthArea(mehData)
    const frown = makeMouthArea(frownData)

    const openEye = makeEyeArea(openEyeData)
    const hurtEye = makeEyeArea(hurtEyeData)
    const madEye = makeEyeArea(madEyeData)

    this.mouthTweens = generateTweenArray({
      ratios: [0, 1/3, 2/3, 1],
      svgs: [frown, meh, smile, openSmile],
    })

    this.eyeTweens = generateTweenArray({
      ratios: [0, 1/3, 2/3, 1],
      svgs: [madEye, hurtEye, openEye, openEye],
    })

    this.state = {
      mouthPath: this.mouthTweens[0].morph,
      eyePath: this.eyeTweens[0].morph,
      ratio: 0,
    }
  }

  componentDidMount() {
    const { ratio } = this.props
    this.setFace(ratio._value)
    ratio.addListener(({ value }) => {
      this.setFace(value)
    })
  }


  setFace = (ratio) => {
    const mouthPath = getTween(ratio, this.mouthTweens)
    const eyePath = getTween(ratio, this.eyeTweens)

    const mouthState = mouthPath.morph
    mouthState.tween(mouthPath.ratio)
    const eyeState = eyePath.morph
    eyeState.tween(eyePath.ratio)

    if (mouthState !== this.state.mouthPath) this.setState({ mouthPath: mouthState })
    if (eyePath !== this.state.eyeState) this.setState({ eyePath: eyeState })
  }

  renderEye = (flip) => {
    const { width } = this.props
    const extraStyles = flip ? {
      transform: [{
        rotateY: '180deg',
      }],
      right: width * 0.28,
    } : {
        left: width * 0.28,
    }

    return (
      <View style={{
        ...extraStyles,
        position: 'absolute',
        top: width * 0.3,
        width: this.eyeSize,
        height: this.eyeSize,
      }}>
      <Surface width={this.eyeSize} height={this.eyeSize}>
        <Group>
          <AnimatedShape
            d={this.state.eyePath}
            stroke={featureColor}
            fill={featureColor}
            strokeWidth={1}
          />
        </Group>
      </Surface>
      </View>
    )
  }
  

  render() {
    const { width } = this.props
    return (
      <View style={{ 
        width,
        height: width,
      }}>
        <Animated.View
          style={{
            position: 'absolute',
            width: width,
            height: width,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Animated.View
            style={{
              position: 'absolute',
              borderRadius: width,
              backgroundColor: 'blue',
              width: '70%',
              height: '70%',
              shadowOffset: { width: 0, height: 1 },
              shadowColor: 'black',
              shadowOpacity: 0.25,
              shadowRadius: 2,
            }}
          />
          <Animated.View
            style={{
              position: 'absolute',
              borderRadius: width,
              backgroundColor: this.color,
              width: '70%',
              height: '70%',
        }}
      />

            {this.renderEye()}
            {this.renderEye(true)}

          <View style={{
            position: 'absolute',
            top: width * 0.52,
            left: 0,
            right: 0,
            bottom: 0,
          }}>
            <Surface width={width} height={width}>
              <Group>
                <AnimatedShape
                  d={this.state.mouthPath}
                  stroke={featureColor}
                  fill={featureColor}
                  strokeWidth={width / 13  }
                />
              </Group>
            </Surface>
          </View>
        </Animated.View>
      </View>
    );
  }
}
