// import Avatar from '@material-ui/core/Avatar';
import React from 'react';
import PropTypes from 'prop-types';
import base from '../base';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { utils } from 'web3';
import { Image } from 'react-native-web';
import { Row, Column, Button, Text } from '@morpheus-ui/core';
import applyContext from '../hocs/Context';
import styled, { css } from 'styled-components/native';

const TableContainer = styled.View`
  width: 100%;
  margin-bottom: ${props => props.theme.spacing};
`;

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
`;

function condenseAddress(address) {
  const len = 4;
  return (
    address.slice(0, len + 2) + '...' + address.slice(-len, address.length)
  );
}

let rowId = 0;
function createData(identifier, avatar, comment, date, time, value) {
  rowId += 1;
  return { rowId, identifier, avatar, comment, date, time, value };
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
              let rows = [];
              transactionData.forEach((transaction, index) => {
                const ethAmount = utils.fromWei(transaction.value);
                rows.push(
                  createData(
                    transaction.receipt.to,
                    '',
                    transaction.comment,
                    this.formattedDate(transaction.timestamp * 1000),
                    this.formattedTime(transaction.timestamp * 1000),
                    ethAmount,
                  ),
                );
              });
              this.setState({ rows: this.sortRowData(rows) });
            },
          },
        );
      } catch (error) {
        // Catch any errors for any of the above operations.
        console.error(error);
      }
    }
  };

  sortRowData = rows => {
    const sortedRows = {};
    rows.forEach(row => {
      if (sortedRows[row.date] !== undefined) {
        const temp = [...sortedRows[row.date], row];
        temp.sort((a, b) => {
          if (a.time > b.time) return -1;
          else if (a.time < b.time) return 1;
          else return 0;
        });
        sortedRows[row.date] = temp;
      } else {
        sortedRows[row.date] = [row];
      }
    });
    return Object.entries(sortedRows);
  };

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
      <>
        {this.state.rows.map(keyValuePair => {
          const date = keyValuePair[0];
          const rows = keyValuePair[1];
          return (
            <TableContainer>
              <DateContainer>
                <Text>{date}</Text>
              </DateContainer>
              {rows.map((row, index) => {
                let sent = true;
                this.props.accounts.forEach(account => {
                  if (account === row.identifier) {
                    sent = false;
                  }
                });
                return (
                  <TransactionContainer
                    onMouseEnter={() => this.enterHover(row.rowId)}
                    onMouseLeave={this.leaveHover}
                    hover={this.state.hover === row.rowId}
                    lastChild={index === rows.length - 1}
                  >
                    <Row size={12} variant="no-border">
                      <Column lg={1} md={1} sm={12}>
                        <Image
                          source={
                            sent
                              ? require('../img/sent.svg')
                              : require('../img/received.svg')
                          }
                          style={{ width: 30, height: 30 }}
                        />
                      </Column>
                      <Column lg={1} md={1} sm={12}>
                        <Text>{sent ? 'Sent' : 'Received'}</Text>
                        <TimeContainer>
                          <Text variant="faded">{row.time}</Text>
                        </TimeContainer>
                      </Column>
                      <Column lg={2} md={3} sm={12}>
                        <CopyToClipboard text={row.identifier}>
                          <Button
                            title={condenseAddress(row.identifier)}
                            variant={['no-border', 'textLike']}
                            onPress={() => this.onAddressCopy(row.rowId)}
                          />
                        </CopyToClipboard>
                        <Text variant={['faded', 'small']}>
                          {this.state.copied === row.rowId &&
                            'copied to clipboard'}
                        </Text>
                      </Column>
                      <Column lg={6} md={5} sm={12}>
                        <Text>{row.comment}</Text>
                      </Column>
                      <Column lg={2} md={2} sm={12}>
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
      </>
    );
  }
}

SimpleTable.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.string),
  network: PropTypes.string,
};

export default applyContext(SimpleTable);
