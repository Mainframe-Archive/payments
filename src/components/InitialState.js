import React from 'react';
import styled, { css } from 'styled-components/native';
import Transactions from './Transactions';
import applyContext from '../hocs/Context';
import { Row, Column, Button, Text } from '@morpheus-ui/core';
import { PlusSymbol } from '@morpheus-ui/icons';

const Container = styled.View`
  padding: ${props => props.theme.spacing};
  ${props =>
    props.screenWidth <= 900 &&
    css`
      width: 150px;
    `};
`;

class InitialState extends React.Component {
  render() {
    return (
      <Container>
        <Text variant="h2">{'Welcome!'}</Text>
        <Text>
          {
            'Make your first transfer to start using the Mainframe Payments app. Lorem ipsum dolor sit amet, consectetur.'
          }
        </Text>
        <Button
          title="new transfer"
          variant={['no-border']}
          Icon={PlusSymbol}
        />
      </Container>
    );
  }
}

export default applyContext(InitialState);
