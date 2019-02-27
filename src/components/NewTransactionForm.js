import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native-web';
import screenSize from '../hocs/ScreenSize';
import applyContext from '../hocs/Context';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
  Column,
  Row,
  TextField,
  DropDown,
  Button,
  Text,
} from '@morpheus-ui/core';
import styled, { css } from 'styled-components/native';

const PositionContainer = styled.View`
  position: relative;
  height: 100%;
`;

const FormContainer = screenSize(styled.View`
  position: absolute;
  height: 360px;
  width: 450px;
  top: 50%;
  left: 50%;
  margin-left: -225px;
  margin-top: -250px;

  ${props =>
    props.screenWidth <= 700 &&
    css`
      width: 90%;
      margin-left: -45%;
    `};

  ${props =>
    props.screenHeight >= 1100 &&
    css`
      top: 0;
      margin-top: 200px;
    `};
`);

const ButtonContainer = screenSize(styled.View`
  margin: 0 auto;
  width: 200px;
  margin-top: 70px;
`);

const LoadingContainer = styled.View`
  margin: 0 auto;
  max-width: 96px;
  max-height: 26px;
  margin-top: 9px;
`;

const LoadingTextContainer = styled.View`
  margin: 0 auto;
  width: 328px;
`;

const InfoContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 326px;
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
      openContacts,
      loading,
      classes,
      amountValidation,
      accountValidation,
    } = this.props;

    return (
      <PositionContainer>
        <FormContainer>
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
                value={to}
                onFocus={openContacts}
                variant={[
                  'outlined',
                  'filled',
                  loading ? 'disabled' : '',
                  'disabledLabel',
                ]}
                disabled={loading}
                required
                validation={accountValidation}
              />
            </Column>
            <Column lg={3} md={3} sm={3}>
              <DropDown
                options={['MFT', 'ETH']}
                checkedLabel={currency}
                defaultValue={currency}
                onChange={handleChange('currency')}
                disabled={loading}
                variant={['filled', 'disabled']}
              />
            </Column>
            <Column lg={9} md={9} sm={9}>
              <TextField
                label={'Amount'}
                name="amount"
                value={amount}
                onChange={handleChange('amount')}
                variant={[
                  'outlined',
                  'filled',
                  loading ? 'disabled' : '',
                  'disabledLabel',
                ]}
                disabled={loading}
                required
                validation={amountValidation}
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
                    title="PAY"
                    variant={['filled', 'green', 'hover-shadow', 'size100']}
                  />
                )}
              </Column>
            </Row>
          </ButtonContainer>
          <LoadingTextContainer>
            {loading && (
              <InfoContainer>
                <Image
                  source={require('../img/info.svg')}
                  style={{ width: 18, height: 18 }}
                />
                <Text variant={['faded', 'small']}>
                  {'This may take a few minutes. We appreciate your patience.'}
                </Text>
              </InfoContainer>
            )}
          </LoadingTextContainer>
        </FormContainer>
      </PositionContainer>
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
