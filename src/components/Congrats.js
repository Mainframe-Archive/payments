import React from 'react';
import PropTypes from 'prop-types';
import screenSize from '../hocs/ScreenSize';
import { Text, Button } from '@morpheus-ui/core';
import styled, { css } from 'styled-components/native';

const Container = screenSize(styled.View`
  margin: 0 auto;
  width: 300px;
  text-align: center;
  position: relative;
  height: 100%;
  ${props =>
    props.screenWidth <= 900 &&
    css`
      width: 95%;
    `};
`);

const TextContainer = screenSize(styled.View`
  margin: 0 auto;
  text-align: left;
  padding-top: ${props => props.theme.spacing};
`);

const ButtonContainer = screenSize(styled.View`
  margin: 0 auto;
  padding: 50px 0;
`);

class CongratsScreen extends React.Component {
  render() {
    const { to, amount, currency, closeTransactionModal } = this.props;
    return (
      <Container>
        <Text variant="h1">{'Congrats!'}</Text>
        <TextContainer>
          <Text>
            {'Woo hoo! This message confirms that you just sent ' +
              amount +
              ' ' +
              currency +
              ' to ' +
              to}
          </Text>
        </TextContainer>
        <ButtonContainer>
          <Button
            title="close"
            variant="green"
            onPress={closeTransactionModal}
          />
        </ButtonContainer>
      </Container>
    );
  }
}

CongratsScreen.propTypes = {
  to: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  closeTransactionModal: PropTypes.bool.isRequired,
};

export default CongratsScreen;
