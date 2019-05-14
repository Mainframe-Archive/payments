// import Avatar from '@material-ui/core/Avatar';
import React from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Image } from 'react-native-web';
import { Row, Column, Button, Text } from '@morpheus-ui/core';
import applyContext from '../hocs/Context';
import screenSize from '../hocs/ScreenSize';
import styled, { css } from 'styled-components/native';
import memoize from 'memoize-one';
import { toArray, orderBy, groupBy } from 'lodash';

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
  padding: 0 10px;
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

const formattedDate = (timestamp) => {
  const today = new Date(timestamp * 1000).toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });
  return today;
}

const formattedTime = (timestamp) => {
  const time = new Date(timestamp * 1000).toLocaleTimeString(undefined, {
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
  });
  return time;
}

class SimpleTable extends React.Component {
  state = {
    rows: [],
    copied: '',
  };

  getData = memoize((transactions) => {
    const transactionsArray = orderBy(toArray(transactions), 'timestamp', 'desc').map(transaction => ({
      ...transaction,
      date: formattedDate(transaction.timestamp),
      time: formattedTime(transaction.timestamp),
    }))
    return groupBy(transactionsArray, 'date')
  })

  condenseAddress(address) {
    const len = 4;
    const ensureChecksumAddr = this.props.web3.utils.toChecksumAddress(address);
    return (
      ensureChecksumAddr.slice(0, len + 2) +
      '...' +
      ensureChecksumAddr.slice(-len, ensureChecksumAddr.length)
    );
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
    const transactions = this.getData(this.props.transactions)
    return (
      <MainContainer>
        {Object.keys(transactions).map(key => {
          const date = key;
          const rows = transactions[key];
          return (
            <TableContainer>
              <DateContainer>
                <Text variant="dateTime">{date}</Text>
              </DateContainer>
              {rows.map((row, index) => {
                let sent = true;
                if (
                  this.props.account.toLowerCase() ===
                  row.receipt.to.toLowerCase()
                ) {
                  sent = false;
                }
                const otherAddress = sent ? row.receipt.to : row.receipt.from;
                return (
                  <TransactionContainer
                    onMouseEnter={() => this.enterHover(row.hash)}
                    onMouseLeave={this.leaveHover}
                    hover={this.state.hover && this.state.hover === row.hash}
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
                          {sent ? '-' + row.value : '+' + row.value}
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
  account: PropTypes.string,
  network: PropTypes.string,
};

export default applyContext(SimpleTable);
