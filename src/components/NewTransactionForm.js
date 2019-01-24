import React from 'react';
import PropTypes from 'prop-types';
import screenSize from '../hocs/ScreenSize';
import { Column, Row, TextField, DropDown } from '@morpheus-ui/core';
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

class NewTransactionForm extends React.Component {
  render() {
    const { account, to, note, amount, currency, handleChange } = this.props;
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
              label="To"
              name="to"
              onChange={handleChange('to')}
              value={to}
              variant={['outlined', 'filled']}
              required
            />
          </Column>
          <Column lg={2} md={2} sm={3}>
            <DropDown
              options={['MFT', 'ETH']}
              checkedLabel={currency}
              defaultValue={currency}
              onChange={handleChange('currency')}
              variant="filled"
            />
          </Column>
          <Column lg={10} md={10} sm={9}>
            <TextField
              label="Amount"
              name="amount"
              value={amount}
              onChange={handleChange('amount')}
              variant={['outlined', 'filled']}
              required
            />
          </Column>
          <Column size={12}>
            <TextField
              label="Notes (optional)"
              name="notes"
              value={note}
              onChange={handleChange('for')}
              variant={['outlined', 'filled']}
            />
          </Column>
        </Row>
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

export default NewTransactionForm;
