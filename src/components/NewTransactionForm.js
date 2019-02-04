import React from 'react';
import PropTypes from 'prop-types';
import screenSize from '../hocs/ScreenSize';
import applyContext from '../hocs/Context';

import { Column, Row, TextField, DropDown, Button } from '@morpheus-ui/core';
import styled, { css } from 'styled-components/native';

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
  min-width: 210px;
  ${props =>
    props.screenWidth <= 350 &&
    css`
      min-width: 200px;
    `};
`);

class NewTransactionForm extends React.Component {
  render() {
    const {
      account,
      to,
      note,
      amount,
      currency,
      handleChange,
      handleClose,
      handlePay,
      openContacts,
    } = this.props;

    return (
      <FormContainer>
        <Row size={12}>
          <Column size={12}>
            <TextField
              label="From"
              value={account}
              name="from"
              disabled
              variant={['outlined', 'filled', 'disabled']}
            />
          </Column>
          <Column size={12}>
            <TextField
              label={to ? '' : 'To'}
              name="to"
              onChange={openContacts}
              value={to}
              variant={['outlined', 'filled', 'disabledLabel']}
              required
            />
          </Column>
          <Column lg={2} md={2} sm={3}>
            <DropDown
              options={['MFT', 'ETH']}
              checkedLabel={currency}
              defaultValue={currency}
              errorMessage="Invalid ETH address"
              onChange={handleChange('currency')}
              variant={['filled', 'disabledLabel']}
            />
          </Column>
          <Column lg={10} md={10} sm={9}>
            <TextField
              label={amount ? '' : 'Amount'}
              name="amount"
              value={amount === 0 ? null : amount}
              onChange={handleChange('amount')}
              variant={['outlined', 'filled', 'disabledLabel']}
              required
            />
          </Column>
          <Column size={12}>
            <TextField
              label={note ? '' : 'Notes'}
              name="notes"
              value={note}
              onChange={handleChange('for')}
              variant={['outlined', 'filled', 'disabledLabel']}
            />
          </Column>
        </Row>
        <ButtonContainer>
          <Row size={12}>
            <Column size={6}>
              <Button
                onPress={handleClose}
                title="CANCEL"
                variant={['cancel', 'size100']}
              />
            </Column>
            <Column size={6}>
              <Button
                submit
                onPress={handlePay}
                title="PAY"
                variant={['filled', 'green', 'hover-shadow', 'size100']}
              />
            </Column>
          </Row>
        </ButtonContainer>
      </FormContainer>
    );
  }
}

NewTransactionForm.propTypes = {
  account: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  note: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default applyContext(NewTransactionForm);
