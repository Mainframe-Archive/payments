// @flow

import withSizes from 'react-sizes'

type Sizes = {
  width: number,
  height: number,
}

export type ScreenSizes = {
  screenWidth: number,
  screenHeight: number,
}

const mapSizesToProps = ({ width, height }: Sizes): ScreenSizes => {
  return {
    screenWidth: width,
    screenHeight: height,
  }
}

export default (Component: any) => withSizes(mapSizesToProps)(Component)
