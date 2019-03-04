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
    amount: null,
    to: '',
    for: '',
    contact: null,
    currency: 'ETH',
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
      contact.data.profile.ethAddress &&
      this.props.web3.utils.isAddress(contact.data.profile.ethAddress)
    ) {
      this.setState({
        validEthAddress: true,
        to: contact.data.profile.name,
        contact: contact,
      });
    } else {
      this.setState({ validEthAddress: false, to: '', contact: null });
    }
  };

  amountValidation = amount => {
    const val = amount.value;
    if (isNaN(val)) {
      return 'Amount must be a number';
    } else if (val <= 0) {
      return 'Amount must be greater than zero';
    } else if (
      this.props.staticBalance !== null &&
      !this.sufficientFunds(this.props.staticBalance, this.state.amount)
    ) {
      return 'Insufficient funds';
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

  payContact = async payload => {
    this.props.web3.eth
      .getBalance(this.props.account)
      .then(resolved => {
        const balance = this.props.web3.utils.fromWei(resolved, 'ether');
        if (this.sufficientFunds(balance, this.state.amount) && payload.valid) {
          this.props.sendPayment(
            this.state.contact.id,
            this.state.contact.data.profile.ethAddress,
            this.state.for,
            this.state.amount,
            this.state.currency,
          );
        } else if (!this.sufficientFunds(balance, this.state.amount)) {
          this.props.setStaticBalance(balance);
        }
      })
      .catch(err => alert('ERROR. Could not get balance. ', err));
  };

  sufficientFunds = (balance, amountToCompare) => {
    // cast to Number here to avoid string comparison
    if (Number(balance) > Number(amountToCompare)) return true;
    else return false;
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
            account={this.props.account}
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
