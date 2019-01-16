// @flow

import React, { createContext } from 'react';

export type PaymentsContext = {
  accounts: ?Array<string>,
  network: ?String,
};

const DEFAULT_CONTEXT = {
  accounts: [],
  network: null,
};

export const { Consumer, Provider } = createContext(DEFAULT_CONTEXT);

export default (Component: any) => {
  return (props: Object) => (
    <Consumer>
      {(value: PaymentsContext) => <Component {...props} {...value} />}
    </Consumer>
  );
};
