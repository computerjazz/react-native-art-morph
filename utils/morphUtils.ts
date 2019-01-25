import Morph from 'art/morph/path';

export function generateTweenArray({ ratios, svgs }: { ratios: number[], svgs: string[] }){
  const numSteps = ratios.length - 1
  return [...Array(numSteps)].map((d, i) => {
    return {
      morph: Morph.Tween(svgs[i], svgs[i + 1]),
      fromRatio: ratios[i],
      toRatio: ratios[i + 1],
      range: ratios[i + 1] - ratios[i],
    }
  })
}

export function getTween(ratio, tweenArray) {
  const tween = tweenArray.find(t => ratio <= t.toRatio)
  return {
    ...tween,
    ratio: (ratio - tween.fromRatio) / tween.range
  }
}