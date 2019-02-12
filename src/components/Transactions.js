// import Avatar from '@material-ui/core/Avatar';
import React from 'react';
import PropTypes from 'prop-types';
import base from '../base';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Image } from 'react-native-web';
import { Row, Column, Button, Text } from '@morpheus-ui/core';
import applyContext from '../hocs/Context';
import screenSize from '../hocs/ScreenSize';
import styled, { css } from 'styled-components/native';

const MainContainer = screenSize(styled.View`
  ${props =>
    props.screenWidth <= 750 &&
    css`
      position: fixed;
      width: 100%;
      height: 100%;
    `};
`);

const TableContainer = screenSize(styled.View`
  width: 100%;
  margin-bottom: ${props => props.theme.spacing};
`);

const TransactionContainer = styled.View`
  border: 1px solid ${props => props.theme.borderGray};
  border-bottom: 0px;
  padding: ${props => props.theme.spacing};
  display: flex;
  align-items: center;
  ${props =>
    props.hover &&
    css`
      box-shadow: 0px 0px 10px rgba(199, 199, 199, 0.6);
    `}
  ${props =>
    props.lastChild &&
    css`
      border-bottom: 1px solid ${props => props.theme.borderGray};
    `}
`;

const TimeContainer = styled.View`
  padding-top: 3px;
`;

const DateContainer = styled.View`
  padding-bottom: 8px;
  padding-top: 10px;
`;

const MobileFloatCenter = styled.View`
  display: block:
  margin: 0 auto;
`;

let rowId = 0;
function createData(receipt, avatar, comment, date, time, value) {
  rowId += 1;
  return { rowId, receipt, avatar, comment, date, time, value };
}

class SimpleTable extends React.Component {
  state = {
    rows: [],
    copied: '',
  };

  componentDidUpdate = async prevProps => {
    // Typical usage (don't forget to compare props):
    if (
      this.props.account !== prevProps.account ||
      this.props.network !== prevProps.network
    ) {
      try {
        console.log(
          `account_transactions/${this.props.account}/${this.props.network}`,
        );
        base.listenTo(
          `account_transactions/${this.props.account}/${this.props.network}`,
          {
            context: this,
            asArray: true,
            then(transactionData) {
              if (transactionData.length === 0) {
                this.props.setInitialStateTrue();
              } else {
                this.props.setInitialStateFalse();
                transactionData.sort((a, b) => {
                  if (a.timestamp > b.timestamp) return -1;
                  else if (b.timestamp > a.timestamp) return 1;
                  else return 0;
                });
                let rows = {};
                transactionData.forEach((transaction, index) => {
                  const ethAmount = transaction.value;
                  const date = this.formattedDate(transaction.timestamp * 1000);
                  const time = this.formattedTime(transaction.timestamp * 1000);
                  const transactionData = createData(
                    transaction.receipt,
                    '',
                    transaction.comment,
                    date,
                    time,
                    ethAmount,
                  );
                  if (rows[date]) {
                    rows[date] = [...rows[date], transactionData];
                  } else {
                    rows[date] = [transactionData];
                  }
                });
                this.setState({ rows: rows });
              }
            },
          },
        );
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert('ERROR. Failed to read from Firebase. ', error);
        console.error(error);
      }
    }
  };

  condenseAddress(address) {
    const len = 4;
    const ensureChecksumAddr = this.props.web3.utils.toChecksumAddress(address);
    return (
      ensureChecksumAddr.slice(0, len + 2) +
      '...' +
      ensureChecksumAddr.slice(-len, ensureChecksumAddr.length)
    );
  }

  formattedDate(timestamp) {
    const today = new Date(timestamp).toLocaleDateString(undefined, {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    });
    return today;
  }

  formattedTime(timestamp) {
    const time = new Date(timestamp).toLocaleTimeString(undefined, {
      hour12: false,
      hour: 'numeric',
      minute: 'numeric',
    });
    return time;
  }

  enterHover = rowId => {
    this.setState({ hover: rowId });
  };

  leaveHover = () => {
    this.setState({ hover: '' });
  };

  onAddressCopy = rowId => {
    this.setState({ copied: rowId });
    setTimeout(() => this.setState({ copied: '' }), 1000);
  };

  render() {
    return (
      <MainContainer>
        {Object.keys(this.state.rows).map(key => {
          const date = key;
          const rows = this.state.rows[key];
          return (
            <TableContainer>
              <DateContainer>
                <Text variant="dateTime">{date}</Text>
              </DateContainer>
              {rows.map((row, index) => {
                let sent = true;
                if (
                  this.props.accounts[0].toLowerCase() ===
                  row.receipt.to.toLowerCase()
                ) {
                  sent = false;
                }
                const otherAddress = sent ? row.receipt.to : row.receipt.from;
                return (
                  <TransactionContainer
                    onMouseEnter={() => this.enterHover(row.rowId)}
                    onMouseLeave={this.leaveHover}
                    hover={this.state.hover === row.rowId}
                    lastChild={index === rows.length - 1}
                  >
                    <Row size={12} variant="no-border">
                      <Column lg={1} md={1} sm={1}>
                        <MobileFloatCenter>
                          <Image
                            source={
                              sent
                                ? require('../img/sent.svg')
                                : require('../img/received.svg')
                            }
                            style={{ width: 30, height: 30 }}
                          />
                        </MobileFloatCenter>
                      </Column>
                      <Column lg={2} md={2} sm={2}>
                        <Text>{sent ? 'Sent' : 'Received'}</Text>
                        <TimeContainer>
                          <Text variant="dateTime">{row.time}</Text>
                        </TimeContainer>
                      </Column>
                      <Column lg={2} md={3} sm={3}>
                        <CopyToClipboard text={otherAddress}>
                          <Button
                            title={this.condenseAddress(otherAddress)}
                            variant={['no-border', 'textLike']}
                            onPress={() => this.onAddressCopy(row.rowId)}
                          />
                        </CopyToClipboard>
                        <Text variant={['faded', 'small']}>
                          {this.state.copied === row.rowId &&
                            'copied to clipboard'}
                        </Text>
                      </Column>
                      <Column lg={5} md={3} sm={3}>
                        <Text>{row.comment}</Text>
                      </Column>
                      <Column lg={2} md={3} sm={3}>
                        <Text variant={sent ? '' : 'green'}>
                          {sent ? '-' + row.value : '+' + row.value} Eth
                        </Text>
                      </Column>
                    </Row>
                  </TransactionContainer>
                );
              })}
            </TableContainer>
          );
        })}
      </MainContainer>
    );
  }
}

SimpleTable.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.string),
  network: PropTypes.string,
};

export default applyContext(SimpleTable);
