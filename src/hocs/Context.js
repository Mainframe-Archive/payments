// @flow

import React, { createContext } from 'react'

export type PaymentsContext = {
  account: ?String,
  network: ?String,
}

const DEFAULT_CONTEXT = {
  account: null,
  network: null,
}

export const { Consumer, Provider } = createContext(DEFAULT_CONTEXT)

const ConsumerWrapper = (Component: any) => {
  // eslint-disable-next-line react/display-name
  return (props: Object) => (
    <Consumer>
      {(value: PaymentsContext) => <Component {...props} {...value} />}
    </Consumer>
  )
}

export default ConsumerWrapper
