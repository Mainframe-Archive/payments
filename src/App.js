import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import ResponsiveDrawer from './components/ResponsiveDrawer';
import MainContainer from './components/MainContainer';
import LoginModal from './components/LoginModal';
import getWeb3 from './components/util/getWeb3';
import { ThemeProvider } from '@morpheus-ui/core';
import { Provider } from './hocs/Context';
import theme from './theme';
import styled from 'styled-components/native';
import base from './base';

const temptheme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: '#0bb634',
      contrastText: '#fff',
      titleText: '#00c730',
    },
    complementary: {
      main: '#15d642',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f44336',
      contrastText: '#999',
    },
  },
});

const Root = styled.View`
  width: 100vw;
  height: 100vh;
  flex: 1;
  flex-direction: row;
`;

class App extends Component {
  state = { web3: null, accounts: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Set web3 to the state
      this.setState({ web3 });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3 or accounts. Check that metamask is unlocked and that paymo is approved, or alternatively take a look at the console for details. You might also be trying to use MainframeOS which this app is not optimized for.`,
      );
      console.log(error);
    }
  };

  getBlockchainData = async () => {
    try {
      // Use web3 to get the user's accounts.
      const accounts = await this.state.web3.eth.getAccounts();
      const network = await this.state.web3.eth.net.getNetworkType();

      // Set accounts and network to the state
      if (
        !this.state.accounts ||
        !this.state.network ||
        this.state.accounts[0] !== accounts[0] ||
        this.state.network !== network
      ) {
        this.setState({ accounts, network });
      }
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3 or accounts. Check that metamask is unlocked or console for details.`,
      );
      console.log(error);
    }
  };

  receiptWasMined = receipt => {
    console.log('The receipt has been mined! ', receipt);
    // will be fired once the receipt is mined

    this.state.web3.eth.getBlock(receipt.blockNumber).then(block => {
      console.log(
        `account_transactions/${this.state.accounts[0]}/${this.state.network}/${
          this.state.transactionHash
        }`,
      );
      base
        .post(
          `account_transactions/${this.state.accounts[0]}/${
            this.state.network
          }/${this.state.transactionHash}`,
          {
            data: {
              comment: this.state.comment,
              value: this.state.weiAmount,
              timestamp: block.timestamp,
              receipt,
            },
          },
        )
        .catch(err => {
          console.error('ERROR: ', err);
        });
    });
  };

  sendTransaction = (recipient, comment, amount) => {
    console.log('this.state: ', this.state);
    if (this.state.network !== 'ropsten') {
      alert(`Please connect to ropsten testnet to use this dApp.`);
      return;
    }
    if (!this.state.web3.utils.isAddress(recipient)) {
      alert(
        `Recipient was not a valid Ethereum address. Please try creating your transaction again.`,
      );
      return;
    }

    const weiAmount = this.state.web3.utils.toWei(amount);
    this.setState({
      recipient: recipient,
      comment: comment,
      transactionAmount: amount,
      weiAmount,
    });

    this.state.web3.eth
      .sendTransaction({
        from: `${this.state.accounts[0]}`,
        to: `${recipient}`,
        value: weiAmount,
      })
      .once('transactionHash', this.printTransactionHash)
      .once('receipt', this.printReceipt)
      .on('confirmation', this.printConfNumber)
      .on('error', this.logError)
      .then(this.receiptWasMined);
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Provider
          value={{
            ...this.state,
            getBlockchainData: this.getBlockchainData,
            receiptWasMined: this.receiptWasMine,
            sendTransaction: this.sendTransaction,
          }}
        >
          <MuiThemeProvider theme={temptheme}>
            <CssBaseline />
            <LoginModal active={this.state.web3 == null} />
            <Root>
              <ResponsiveDrawer web3={this.state.web3} />
              <MainContainer />
            </Root>
          </MuiThemeProvider>
        </Provider>
      </ThemeProvider>
    );
  }
}

export default App;
