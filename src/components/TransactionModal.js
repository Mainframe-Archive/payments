import React from 'react';
import PropTypes from 'prop-types';
import applyContext from '../hocs/Context';
import screenSize from '../hocs/ScreenSize';
import Modal from '@material-ui/core/Modal';
import {
  Column,
  Row,
  Text,
  TextField,
  Button,
  DropDown,
} from '@morpheus-ui/core';
import { Form } from '@morpheus-ui/forms';
import { Close } from '@morpheus-ui/icons';
import styled, { css } from 'styled-components/native';

import getWeb3 from './util/getWeb3';

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
`;

const CloseButtonContainer = styled.View`
  position: absolute;
  right: 0;
`;

const CenterText = styled.View`
  margin: 0 auto;
`;

const FormContainer = screenSize(styled.View`
  margin: 0 auto;
  min-width: 500px;
  ${props =>
    props.screenWidth <= 900 &&
    css`
      min-width: 95%;
    `};
`);

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
    web3: this.props.web3,
    amount: '',
    to: '',
    for: '',
    network: '',
    currency: 'MFT',
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      const network = await web3.eth.net.getNetworkType();

      // Set web3 and accounts to the state
      this.setState({ web3, accounts, network });
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.log(error);
    }
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
    this.setState({ amount: '', to: '', for: '', currency: 'MFT' });
  };

  render() {
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.props.transactionModalOpen}
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
          <FormContainer>
            <Row size={12}>
              <Column size={12}>
                <TextField
                  label="From"
                  value={this.props.accounts && this.props.accounts[0]}
                  name="from"
                  disabled
                  variant={['outlined', 'filled', 'disabled']}
                />
              </Column>
              <Column size={12}>
                <TextField
                  label="To"
                  name="to"
                  onChange={this.handleChange('to')}
                  value={this.state.name}
                  variant={['outlined', 'filled']}
                  required
                />
              </Column>
              <Column lg={2} md={2} sm={3}>
                <DropDown
                  options={['MFT', 'ETH']}
                  checkedLabel={this.state.currency}
                  defaultValue={this.state.currency}
                  onChange={this.handleChange('currency')}
                  variant="filled"
                />
              </Column>
              <Column lg={10} md={10} sm={9}>
                <TextField
                  label="Amount"
                  name="amount"
                  value={this.state.amount}
                  onChange={this.handleChange('amount')}
                  variant={['outlined', 'filled']}
                  required
                />
              </Column>
              <Column size={12}>
                <TextField
                  label="Notes (optional)"
                  name="notes"
                  value={this.state.for}
                  onChange={this.handleChange('for')}
                  variant={['outlined', 'filled']}
                />
              </Column>
            </Row>
          </FormContainer>
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
        </ModalContainer>
      </Modal>
    );
  }
}

TransactionModal.propTypes = {};

export default applyContext(TransactionModal);
