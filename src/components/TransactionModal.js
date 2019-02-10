import React from 'react';
import PropTypes from 'prop-types';
import applyContext from '../hocs/Context';
import NewTransactionForm from './NewTransactionForm';
import CongratsScreen from './Congrats';

import Modal from '@material-ui/core/Modal';
import { Row, Text, Button } from '@morpheus-ui/core';
import { Form } from '@morpheus-ui/forms';

import { Close } from '@morpheus-ui/icons';
import styled from 'styled-components/native';

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
`;

const TitleContainer = styled.View`
  padding: 20px 0;
  margin-bottom: 30px;
  border-bottom: 2px solid ${props => props.theme.borderGray};
  position: relative;
`;

const CloseButtonContainer = styled.View`
  position: absolute;
  right: 35px;
  top: 28px;
`;

const CenterText = styled.View`
  margin: 0 auto;
`;

class TransactionModal extends React.Component {
  state = {
    amount: 0,
    to: '',
    for: '',
    contact: null,
    currency: 'ETH',
    sufficientBalance: false,
    validEthAddress: true,
  };

  handleChange = prop => value => {
    this.setState({ [prop]: value });
  };

  handleClose = () => {
    this.props.handleCloseTransactionModal();
  };

  closeModalAndReset = () => {
    this.setState({ to: '', for: '', amount: '', currency: 'ETH' });
    this.props.handleCloseTransactionModal();
  };

  openContacts = async () => {
    const contact = await this.props.mainframe.contacts.selectContact();
    if (
      contact &&
      (!contact.data.profile.ethAddress ||
        !this.props.web3.utils.isAddress(contact.data.profile.ethAddress))
    ) {
      this.setState({ validEthAddress: false, to: '', contact: null });
    } else if (contact) {
      this.setState({
        validEthAddress: true,
        to: contact.data.profile.name,
        contact: contact,
      });
    } else {
      this.setState({ to: '', contact: null });
    }
  };

  amountValidation = amount => {
    const val = amount.value;
    this.checkSufficientBalance(val);

    if (isNaN(val)) {
      return 'Amount must be a number';
    } else if (!this.state.sufficientBalance) {
      return 'Insufficient balance';
    } else if (val <= 0) {
      return 'Amount must be greater than zero';
    } else {
      return '';
    }
  };

  accountValidation = () => {
    if (!this.state.validEthAddress) {
      return 'Invalid Contact: No ETH Address';
    } else {
      return '';
    }
  };

  checkSufficientBalance = async amount => {
    this.props.accounts &&
      this.props.web3.eth
        .getBalance(this.props.accounts[0])
        .then(resolved => {
          const balance = this.props.web3.utils.fromWei(resolved, 'ether');
          if (balance < amount) {
            this.setState({ sufficientBalance: false });
          } else {
            this.setState({ sufficientBalance: true });
          }
        })
        .catch(err => alert('Could not get balance. ERROR: ', err));
  };

  payContact = payload => {
    if (payload.valid) {
      this.props.sendPayment(
        this.state.contact.id,
        this.state.contact.data.profile.ethAddress,
        this.state.for,
        this.state.amount,
        this.state.currency,
      );
    }
  };

  whichScreen = toggleCongratsScreen => {
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
    // otherwise, display new transaction form
    else {
      return (
        <Form onSubmit={this.payContact}>
          <NewTransactionForm
            amountValidation={this.amountValidation}
            accountValidation={this.accountValidation}
            account={this.props.accounts && this.props.accounts[0]}
            handleChange={this.handleChange}
            handleClose={this.handleClose}
            openContacts={this.openContacts}
            to={this.state.to}
            note={this.state.for}
            amount={this.state.amount}
            currency={this.state.currency}
          />
        </Form>
      );
    }
  };

  render() {
    const { transactionModalOpen, toggleCongratsScreen } = this.props;
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
          {this.whichScreen(toggleCongratsScreen)}
        </ModalContainer>
      </Modal>
    );
  }
}

TransactionModal.propTypes = {
  transactionModalOpen: PropTypes.bool.isRequired,
  toggleCongratsScreen: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  sendPayment: PropTypes.func.isRequired,
};

export default applyContext(TransactionModal);
