import Morph from 'art/morph/path';

export function generateTweenArray({ ratios, svgs }: { ratios: number[], svgs: string[] }){
  const numSteps = ratios.length - 1
  return [...Array(numSteps)].map((d, i) => {
    return {
      morph: Morph.Tween(svgs[i], svgs[i + 1]),
      fromRatio: ratios[i],
      toRatio: ratios[i + 1],
    }
  })
}