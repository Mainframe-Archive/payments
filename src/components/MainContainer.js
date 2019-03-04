import React from 'react';
import styled from 'styled-components/native';
import Transactions from './Transactions';
import InitialState from './InitialState';

import applyContext from '../hocs/Context';

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.white};
  display: flex;
  flex-direction: row;
  padding: ${props => props.theme.spacing};
`;

const TransactionsContainer = styled.View`
  width: 100%;
  overflow: scroll;
`;

class MainContainer extends React.Component {
  render() {
    return (
      <Container>
        <TransactionsContainer>
          {this.props.initialState ? (
            <InitialState />
          ) : (
            <Transactions account={this.props.account} />
          )}
        </TransactionsContainer>
      </Container>
    );
  }
}

export default applyContext(MainContainer);
