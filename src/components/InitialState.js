import React from 'react';
import styled, { css } from 'styled-components/native';
import Transactions from './Transactions';
import applyContext from '../hocs/Context';
import { Row, Column, Button, Text } from '@morpheus-ui/core';
import { CircleArrowRight } from '@morpheus-ui/icons';

const Container = styled.View`
  padding: 40px;
  ${props =>
    props.screenWidth <= 900 &&
    css`
      width: 150px;
    `};
`;

const Description = styled.View`
  margin-top: 10px;
  margin-bottom: ${props => props.theme.spacing};
  width: 50%;
`;

class InitialState extends React.Component {
  render() {
    return (
      <Container>
        <Text variant="h2">{'Welcome!'}</Text>
        <Description>
          <Text>
            {
              'Make your first transfer to start using the Mainframe Payments app. Lorem ipsum dolor sit amet, consectetur.'
            }
          </Text>
        </Description>
        <Button
          title="NEW TRANSFER"
          variant={['borderless']}
          Icon={CircleArrowRight}
          onPress={this.props.handleOpenTransactionModal}
        />
      </Container>
    );
  }
}

export default applyContext(InitialState);
