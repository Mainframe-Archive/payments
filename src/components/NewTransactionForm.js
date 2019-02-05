import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import screenSize from '../hocs/ScreenSize';
import applyContext from '../hocs/Context';
import { withStyles } from '@material-ui/core/styles';
import { Form } from '@morpheus-ui/forms';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Column, Row, TextField, DropDown, Button } from '@morpheus-ui/core';
import styled, { css } from 'styled-components/native';

const FormContainer = screenSize(styled.View`
  margin: 0 auto;
  width: 38%;
  min-width: 350px;
  max-width: 1200px;
  ${props =>
    props.screenWidth <= 900 &&
    css`
      min-width: 80%;
    `};
  ${props =>
    props.screenWidth <= 700 &&
    css`
      min-width: 95%;
    `};
`);

const ButtonContainer = screenSize(styled.View`
  margin: 0 auto;
  min-width: 200px;
  ${props =>
    props.screenWidth <= 350 &&
    css`
      min-width: 200px;
    `};
`);

const DropDownContainer = styled.View`
  z-index: 10000;
  position: relative;
`;

const LoadingContainer = styled.View`
  margin: 0 auto;
  max-width: 96px;
  max-height: 26px;
  margin-top: 9px;
`;

const styles = theme => ({
  progress: {
    maxWidth: 14,
    maxHeight: 14,
    color: '#8EDA11',
  },
});

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
      loading,
      classes,
    } = this.props;

    return (
      <FormContainer>
        <Form>
          <Row size={12}>
            <Column size={12}>
              <TextField
                label="From"
                value={account}
                name="from"
                disabled
                variant={['outlined', 'filled', 'disabled', 'disabledLabel']}
              />
            </Column>
            <Column size={12}>
              <TextField
                label={'To'}
                name="to"
                onChange={openContacts}
                value={to}
                disabled={loading}
                variant={[
                  'outlined',
                  'filled',
                  loading ? 'disabled' : '',
                  'disabledLabel',
                ]}
                required
              />
            </Column>
            <Column lg={3} md={3} sm={3}>
              <DropDownContainer>
                <DropDown
                  options={['MFT', 'ETH']}
                  checkedLabel={currency}
                  defaultValue={currency}
                  errorMessage="Invalid ETH address"
                  onChange={handleChange('currency')}
                  disabled={loading}
                  variant={['filled', 'disabled']}
                />
              </DropDownContainer>
            </Column>
            <Column lg={9} md={9} sm={9}>
              <TextField
                label={'Amount'}
                name="amount"
                value={amount === 0 ? null : amount}
                onChange={handleChange('amount')}
                variant={[
                  'outlined',
                  'filled',
                  loading ? 'disabled' : '',
                  'disabledLabel',
                ]}
                disabled={loading}
                required
              />
            </Column>
            <Column size={12}>
              <TextField
                label={'Notes (optional)'}
                name="notes"
                value={note}
                onChange={handleChange('for')}
                variant={[
                  'outlined',
                  'filled',
                  loading ? 'disabled' : '',
                  'disabledLabel',
                ]}
                disabled={loading}
              />
            </Column>
          </Row>
          <ButtonContainer>
            <Row size={12}>
              <Column size={6}>
                <Button
                  onPress={handleClose}
                  title="CANCEL"
                  variant={['cancel', loading ? 'disabled' : '', 'size100']}
                  disabled={loading}
                />
              </Column>
              <Column size={6}>
                {loading ? (
                  <LoadingContainer>
                    <CircularProgress className={classes.progress} />
                  </LoadingContainer>
                ) : (
                  <Button
                    submit
                    onPress={handlePay}
                    title="PAY"
                    variant={['filled', 'green', 'hover-shadow', 'size100']}
                  />
                )}
              </Column>
            </Row>
          </ButtonContainer>
        </Form>
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
  loading: PropTypes.bool.isRequired,
};

export default applyContext(withStyles(styles)(NewTransactionForm));
