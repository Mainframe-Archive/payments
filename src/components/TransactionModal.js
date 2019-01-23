import React from 'react';
import PropTypes from 'prop-types';
import applyContext from '../hocs/Context';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { Column, Row, Text, TextInput, Button } from '@morpheus-ui/core';
import { Form } from '@morpheus-ui/forms';
import { Close } from '@morpheus-ui/icons';
import styled from 'styled-components/native';

import getWeb3 from './util/getWeb3';

const ModalContainer = styled.View`
  width: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: relative;
  margin: 0 auto;
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
const Container = styled.View`
  width: 100%;
`;

class TransactionModal extends React.Component {
  state = {
    web3: this.props.web3,
    open: this.props.transactionModalOpen,
    amount: '',
    to: '',
    for: '',
    accounts: [],
    network: '',
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

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleClose = () => {
    this.props.handleCloseTransactionModal();
  };

  handlePay = () => {
    this.props.sendTransaction(
      this.state.to,
      this.state.for,
      this.state.amount,
    );
  };

  render() {
    const { classes } = this.props;

    return (
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
        <Container>
          <Row size={12}>
            <Column lg={8}>
              <TextField
                type="text"
                label="to"
                name="to"
                onChange={this.handleChange('to')}
                value={this.state.name}
                variant="outlined"
                required
              />
            </Column>
          </Row>
          <Row size={12}>
            <Column lg={8}>
              <TextField
                type="text"
                label="MFT amount"
                name="amount"
                value={this.state.amount}
                onChange={this.handleChange('amount')}
                variant="outlined"
                required
              />
            </Column>
          </Row>
          <Row size={12}>
            <Column lg={8}>
              <TextField
                type="text"
                label="Notes"
                name="notes"
                value={this.state.for}
                onChange={this.handleChange('for')}
                variant="outlined"
                required
              />
            </Column>
          </Row>
        </Container>
        <Row size={12}>
          <Column lg={1}>
            <Button
              onPress={this.handlePay}
              title="CANCEL"
              variant="borderless"
            />
          </Column>
          <Column lg={1}>
            <Button onPress={this.handlePay} title="PAY" variant="filled" />
          </Column>
        </Row>
      </ModalContainer>
    );
  }
}

TransactionModal.propTypes = {};

export default applyContext(TransactionModal);
