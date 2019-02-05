import React from 'react';
import PropTypes from 'prop-types';
import applyContext from '../hocs/Context';
import NewTransactionForm from './NewTransactionForm';
import CongratsScreen from './Congrats';

import Modal from '@material-ui/core/Modal';
import { Row, Text, Button } from '@morpheus-ui/core';
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
    if (contact && !contact.data.profile.ethAddress) {
      alert(`No eth address found for contact: ${contact.id}`);
    } else if (contact) {
      this.setState({ to: contact.data.profile.name, contact: contact });
    }
  };

  payContact = () => {
    if (
      this.state.contact &&
      this.state.contact.id &&
      this.state.contact.data.profile.ethAddress &&
      this.state.amount !== 0
    ) {
      this.props.sendPayment(
        this.state.contact.id,
        this.state.contact.data.profile.ethAddress,
        this.state.for,
        this.state.amount,
        this.state.currency,
        new Date().getTime() / 1000,
      );
    } else {
      alert('Missing field(s)');
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
        <>
          <NewTransactionForm
            account={this.props.accounts && this.props.accounts[0]}
            handleChange={this.handleChange}
            handleClose={this.handleClose}
            handlePay={this.payContact}
            openContacts={this.openContacts}
            to={this.state.to}
            note={this.state.for}
            amount={this.state.amount}
            currency={this.state.currency}
          />
        </>
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
