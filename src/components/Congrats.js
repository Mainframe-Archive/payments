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
  text-align: center;
  padding-top: ${props => props.theme.spacing};
`);

const ButtonContainer = screenSize(styled.View`
  margin: 0 auto;
  padding-top: 35vh;
`);

class CongratsScreen extends React.Component {
  render() {
    const { to, amount, currency, closeTransactionModal } = this.props;
    return (
      <Container>
        <Text variant={['h2', 'h2Poppins']}>{'Payment Complete!'}</Text>
        <TextContainer>
          <Text>
            {"You've sent " +
              to +
              amount +
              ' ' +
              currency +
              '. Go to Activity to review all of your completed transfers.'}
          </Text>
        </TextContainer>
        <ButtonContainer>
          <Button
            title="CLOSE"
            variant={['green', 'size100']}
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
