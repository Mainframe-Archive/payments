import React from 'react';
import styled, { css } from 'styled-components/native';
import Transactions from './Transactions';
import applyContext from '../hocs/Context';

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.white};
  display: flex;
  flex-direction: row;
  padding: ${props => props.theme.spacing};

  ${props =>
    props.screenWidth <= 900 &&
    css`
      width: 150px;
    `};
`;

const TransactionsContainer = styled.View`
  width: 100%;
  overflow: scroll;
  ${props =>
    props.screenWidth <= 900 &&
    css`
      padding: 0px;
      width: 90%;
    `};
`;

class MainContainer extends React.Component {
  render() {
    return (
      <Container>
        <TransactionsContainer>
          <Transactions
            account={this.props.accounts && this.props.accounts[0]}
            network={this.props.network && this.props.network}
          />
        </TransactionsContainer>
      </Container>
    );
  }
}

export default applyContext(MainContainer);
