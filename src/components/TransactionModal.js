import React from 'react';
import PropTypes from 'prop-types';
import applyContext from '../hocs/Context';
import screenSize from '../hocs/ScreenSize';
import NewTransactionForm from './NewTransactionForm';
import CongratsScreen from './Congrats';

import Modal from '@material-ui/core/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Column, Row, Text, Button } from '@morpheus-ui/core';
import { Close } from '@morpheus-ui/icons';
import { Form } from '@morpheus-ui/forms';
import styled, { css } from 'styled-components/native';

const ModalContainer = styled.View`
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: relative;
  margin: 0 auto;
  background-color: ${props => props.theme.white};
  padding: ${props => props.theme.spacing};
`;

const TitleContainer = styled.View`
  padding-bottom: 30px;
  margin-bottom: 30px;
  border-bottom: 2px solid ${props => props.theme.borderGray};
  position: relative;
`;

const CloseButtonContainer = styled.View`
  position: absolute;
  right: 0;
`;

const CenterText = styled.View`
  margin: 0 auto;
`;

const LoadingContainer = styled.View`
  margin: 0 auto;
  position: absolute;
  top: 50%;
  margin-top: -25px;
  left: 50%;
  margin-left: -25px;
`;

const ButtonContainer = screenSize(styled.View`
  margin: 0 auto;
  min-width: 300px;
  ${props =>
    props.screenWidth <= 350 &&
    css`
      min-width: 200px;
    `};
`);

class TransactionModal extends React.Component {
  state = {
    amount: '',
    to: '',
    for: '',
    currency: 'MFT',
  };

  handleChange = prop => value => {
    this.setState({ [prop]: value });
  };

  handleClose = () => {
    this.props.handleCloseTransactionModal();
  };

  handlePay = () => {
    this.props.sendTransaction(
      this.state.to,
      this.state.for,
      this.state.amount,
      this.state.currency,
    );
  };

  closeModalAndReset = () => {
    this.setState({ to: '', for: '', amount: '', currency: 'MFT' });
    this.props.handleCloseTransactionModal();
  };

  whichScreen = (toggleCongratsScreen, loading) => {
    // if congrats screen should display
    if (toggleCongratsScreen === true) {
      return (
        <CongratsScreen
          to={this.state.to}
          amount={this.state.amount}
          currency={this.state.currency}
          closeTransactionModal={this.closeModalAndReset}
        />
      );
    }
    // if loading screen should display
    else if (loading === true) {
      return (
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      );
    }
    // otherwise, display new transaction form
    else {
      return (
        <>
          <Form>
            <NewTransactionForm
              account={this.props.accounts && this.props.accounts[0]}
              handleChange={this.handleChange}
              to={this.state.to}
              note={this.state.for}
              amount={this.state.amount}
              currency={this.state.currency}
            />
          </Form>
          <ButtonContainer>
            <Row size={12}>
              <Column size={6}>
                <Button
                  onPress={this.handleClose}
                  title="CANCEL"
                  variant="cancel"
                />
              </Column>
              <Column size={6}>
                <Button
                  onPress={this.handlePay}
                  title="PAY"
                  variant={['filled', 'green', 'hover-shadow']}
                />
              </Column>
            </Row>
          </ButtonContainer>
        </>
      );
    }
  };

  render() {
    const { transactionModalOpen, toggleCongratsScreen, loading } = this.props;
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={transactionModalOpen}
        onClose={this.handleClose}
      >
        <ModalContainer>
          <TitleContainer>
            <Row size={12}>
              <CenterText>
                <Text variant="modalTitle">{'NEW TRANSFER'}</Text>
              </CenterText>
            </Row>
            <CloseButtonContainer>
              <Button
                Icon={Close}
                onPress={this.handleClose}
                variant={['no-border', 'close']}
              />
            </CloseButtonContainer>
          </TitleContainer>
          {this.whichScreen(toggleCongratsScreen, loading)}
        </ModalContainer>
      </Modal>
    );
  }
}

TransactionModal.propTypes = {
  transactionModalOpen: PropTypes.bool.isRequired,
  toggleCongratsScreen: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default applyContext(TransactionModal);
