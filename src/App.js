import React, { Component } from 'react';
import MainframeSDK from '@mainframe/sdk';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
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
      main: '#8EDA11',
      contrastText: '#fff',
      titleText: '#fff',
    },
    complementary: {
      main: '#15d642',
      contrastText: '#fff',
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
  state = {
    mainframe: null,
    web3: null,
    account: null,
    network: null,
    transactionModalOpen: false,
    loading: false,
    toggleCongratsScreen: false,
    initialState: false,
    reloadFirebase: false,
    staticBalance: null,
  };

  componentDidMount = async () => {
    try {
      // init Mainframe SDK
      const sdk = new MainframeSDK();
      // Get network provider and web3 instance.
      const web3 = await getWeb3(sdk);

      // Set web3 to the state
      this.setState({ web3: web3, mainframe: sdk });

      // initial fetch of blockchain data
      this.getBlockchainData();

      // even listener for account & network updates
      sdk.ethereum.on('accountsChange', accounts => {
        this.getBlockchainData();
      });
      sdk.ethereum.on('networkChange', network => {
        this.getBlockchainData();
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3 or accounts. Check that paymo is approved, or the console for more details.`,
      );
      console.error(error);
    }
  };

  getBlockchainData = async () => {
    try {
      // Use web3 to get the user's accounts.
      const account = this.state.mainframe.ethereum.selectedAccount;
      const network = this.state.mainframe.ethereum.networkVersion;

      // Set accounts and network to the state
      if (
        account !== undefined &&
        network !== undefined &&
        (!this.state.account ||
          !this.state.network ||
          this.state.account !== account ||
          this.state.network !== network)
      ) {
        this.setState({ account, network, staticBalance: null });
      }
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(`Failed to load web3 or accounts. Check the console for details.`);
      console.error(error);
    }
  };

  sendPayment = async (contactID, to, comment, amount, currency) => {
    const recipient = this.state.web3.utils.toChecksumAddress(to);

    const simpleReceipt = {
      to: recipient,
      from: this.state.account,
    };

    const transactionData = {
      comment: comment,
      value: amount,
      receipt: simpleReceipt,
    };

    const paymentParams = {
      contactID: contactID,
      currency: currency,
      value: amount,
    };

    if (this.state.network !== '3') {
      alert(`Please connect to ropsten testnet to use this dApp.`);
      return;
    }

    if (!this.state.web3.utils.isAddress(recipient)) {
      alert(
        `Recipient was not a valid Ethereum address. Please try creating your transaction again.`,
      );
      return;
    }

    this.handlePayment(transactionData, paymentParams, recipient);
  };

  handlePayment = async (transactionData, paymentParams, recipient) => {
    const res = await this.state.mainframe.payments.payContact(paymentParams);
    res
      .on('hash', hash => {
        this.setState({
          transactionHash: hash,
          loading: true,
        });
      })
      .on('confirmed', () => {
        this.writeToFirebase(transactionData, recipient);
      })
      .on('error', this.logError);
  };

  writeToFirebase = (transactionData, recipient) => {
    const timestamp = Date.now() / 1000;
    transactionData.timestamp = timestamp;
    const network = this.state.network === '3' ? 'ropsten' : 'other';
    base
      .post(
        `account_transactions/${this.state.account}/${network}/${
          this.state.transactionHash
        }`,
        { data: transactionData },
      )
      .catch(err => {
        alert('ERROR. Failed to write to Firebase. ', err);
      });

    // add transaction data to recipient's history
    base
      .post(
        `account_transactions/${recipient}/${network}/${
          this.state.transactionHash
        }`,
        {
          data: transactionData,
        },
      )
      .catch(err => {
        alert('ERROR. Failed to write to Firebase. ', err);
      });

    this.setState({
      toggleCongratsScreen: true,
      loading: false,
      reloadFirebase: true,
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

  resetReloadFirebase = () => {
    this.setState({ reloadFirebase: false });
  };

  setStaticBalance = bal => {
    this.setState({ staticBalance: bal });
  };

  logError = error => {
    alert('ERROR. Contact payment failed. ', error);
    this.setState({
      loading: false,
      transactionModalOpen: false,
      toggleCongratsScreen: false,
    });
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Provider
          value={{
            ...this.state,
            setInitialStateTrue: this.setInitialStateTrue,
            setInitialStateFalse: this.setInitialStateFalse,
            getBlockchainData: this.getBlockchainData,
            sendPayment: this.sendPayment,
            handleOpenTransactionModal: this.handleOpenTransactionModal,
            handleCloseTransactionModal: this.handleCloseTransactionModal,
            resetReloadFirebase: this.resetReloadFirebase,
            setStaticBalance: this.setStaticBalance,
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
