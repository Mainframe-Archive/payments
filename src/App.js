import React, { Component } from 'react';
import MainframeSDK from '@mainframe/sdk';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import ResponsiveDrawer from './components/ResponsiveDrawer';
import MainContainer from './components/MainContainer';
import LoginModal from './components/LoginModal';
import getWeb3 from './components/util/getWeb3';
import { ThemeProvider } from '@morpheus-ui/core';
import { Provider } from './hocs/Context';
import screenSize from './hocs/ScreenSize';
import theme from './theme';
import styled, { css } from 'styled-components/native';
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

const Root = screenSize(styled.View`
  width: 100vw;
  height: 100vh;
  flex: 1;
  flex-direction: row;
  ${props =>
    props.screenWidth <= 900 &&
    css`
      flex-direction: column;
    `};
`);

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    network: null,
    transactionModalOpen: false,
    loading: false,
    toggleCongratsScreen: false,
    initialState: false,
  };

  componentDidMount = async () => {
    const sdk = new MainframeSDK();
    const res = await sdk.apiVersion();

    console.log(res);
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
      const simpleReceipt = {
        to: receipt.to,
        from: receipt.from,
      };

      const transactionData = {
        comment: this.state.comment,
        value: this.state.weiAmount,
        timestamp: block.timestamp,
        receipt: simpleReceipt,
      };

      base
        .post(
          `account_transactions/${this.state.accounts[0]}/${
            this.state.network
          }/${this.state.transactionHash}`,
          { data: transactionData },
        )
        .catch(err => {
          console.error('ERROR: ', err);
        });

      // add transaction data to recipient's history
      const recipient = this.state.web3.utils.toChecksumAddress(
        this.state.recipient,
      );
      base
        .post(
          `account_transactions/${recipient}/${this.state.network}/${
            this.state.transactionHash
          }`,
          { data: transactionData },
        )
        .catch(err => {
          console.error('ERROR: ', err);
        });
    });

    // trigger congrats screen & stop loading screen
    this.setState({ toggleCongratsScreen: true, loading: false });
  };

  sendTransaction = (recipient, comment, amount, currency) => {
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
    this.state.web3.eth.getBalance(this.state.accounts[0]).then(resolved => {
      if (this.state.web3.utils.fromWei(resolved, 'ether') < amount) {
        this.setState({ loading: false });
        alert('Insufficient balance');
      } else {
        const weiAmount = this.state.web3.utils.toWei(amount);
        this.setState({
          recipient: recipient,
          comment: comment,
          transactionAmount: amount,
          weiAmount,
          loading: true,
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
      }
    });
  };

  handleOpenTransactionModal = () => {
    this.setState({ transactionModalOpen: true });
  };

  handleCloseTransactionModal = () => {
    this.setState({ transactionModalOpen: false, toggleCongratsScreen: false });
  };

  printTransactionHash = transactionHash => {
    console.log('transactionHash: ', transactionHash);
    this.setState({ transactionHash });
  };

  setInitialStateTrue = () => {
    this.setState({ initialState: true });
  };

  setInitialStateFalse = () => {
    this.setState({ initialState: false });
  };

  printReceipt(receipt) {
    console.log('receipt: ', receipt);
  }

  printConfNumber(confNumber, receipt) {
    console.log('confNumber: ', confNumber, receipt);
  }

  logError(error) {
    console.error('ERROR: ', error);
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Provider
          value={{
            ...this.state,
            setInitialStateTrue: this.setInitialStateTrue,
            setInitialStateFalse: this.setInitialStateFalse,
            getBlockchainData: this.getBlockchainData,
            sendTransaction: this.sendTransaction,
            handleOpenTransactionModal: this.handleOpenTransactionModal,
            handleCloseTransactionModal: this.handleCloseTransactionModal,
          }}
        >
          <MuiThemeProvider theme={temptheme}>
            <LoginModal active={this.state.web3 == null} />
            <Root>
              <ResponsiveDrawer />
              <MainContainer />
            </Root>
          </MuiThemeProvider>
        </Provider>
      </ThemeProvider>
    );
  }
}

export default App;
