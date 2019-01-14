import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import MenuIcon from "@material-ui/icons/Menu";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AccessTime from "@material-ui/icons/AccessTime";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Transactions from "./Transactions";
import TransactionModal from "./TransactionModal";
import base from "../base";

import styled, { css } from "styled-components/native";
import { Button } from "@morpheus-ui/core";

const drawerWidth = 240;

const Container = styled.View`
  width: 250px;
  height: 100%;
  background-color: ${props => props.theme.lightGray};
  display: flex;
  flex-direction: row;
  ${props =>
    props.screenWidth <= 900 &&
    css`
      width: 150px;
    `};
`;

const SidebarContainer = styled.View`
  width: 100%;
  background-color: ${props => props.theme.lightGray};
  ${props =>
    props.screenWidth <= 900 &&
    css`
      padding: 0px;
      width: 90%;
    `};
  ${props =>
    props.screenWidth <= 700 &&
    css`
      width: 0;
    `};
`;

class ResponsiveDrawer extends React.Component {
  state = {
    mobileOpen: false,
    web3: this.props.web3,
    transactionModalOpen: false,
    accounts: [],
    network: null
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  handleOpenTrandactionModal = () => {
    this.setState({ transactionModalOpen: true });
  };

  handleCloseTrandactionModal = () => {
    this.setState({ transactionModalOpen: false });
  };

  sendTransaction = (recipient, comment, amount) => {
    console.log("this.state: ", this.state);
    if (this.state.network !== "ropsten") {
      alert(`Please connect to ropsten testnet to use this dApp.`);
      return;
    }
    if (!this.props.web3.utils.isAddress(recipient)) {
      alert(
        `Recipient was not a valid Ethereum address. Please try creating your transaction again.`
      );
      return;
    }

    const weiAmount = this.props.web3.utils.toWei(amount);
    this.setState({
      recipient: recipient,
      comment: comment,
      transactionAmount: amount,
      weiAmount
    });

    this.props.web3.eth
      .sendTransaction({
        from: `${this.state.accounts[0]}`,
        to: `${recipient}`,
        value: weiAmount
      })
      .once("transactionHash", this.printTransactionHash)
      .once("receipt", this.printReceipt)
      .on("confirmation", this.printConfNumber)
      .on("error", this.logError)
      .then(this.receiptWasMined);
  };

  printTransactionHash = transactionHash => {
    console.log("transactionHash: ", transactionHash);
    this.setState({ transactionHash, transactionModalOpen: false });
  };

  printReceipt(receipt) {
    console.log("receipt: ", receipt);
  }

  printConfNumber(confNumber, receipt) {
    console.log("confNumber: ", confNumber, receipt);
  }

  logError(error) {
    console.error("ERROR: ", error);
  }

  receiptWasMined = receipt => {
    console.log("The receipt has been mined! ", receipt);
    // will be fired once the receipt is mined

    this.props.web3.eth.getBlock(receipt.blockNumber).then(block => {
      console.log(
        `account_transactions/${this.state.accounts[0]}/${this.state.network}/${
          this.state.transactionHash
        }`
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
              receipt
            }
          }
        )
        .catch(err => {
          console.error("ERROR: ", err);
        });
    });
  };

  getBlockchainData = async () => {
    try {
      // Use web3 to get the user's accounts.
      const accounts = await this.props.web3.eth.getAccounts();
      const network = await this.props.web3.eth.net.getNetworkType();

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
        `Failed to load web3 or accounts. Check that metamask is unlocked or console for details.`
      );
      console.log(error);
    }
  };

  render() {
    const { classes, theme, web3 } = this.props;

    if (web3) {
      this.getBlockchainData();
    } else {
      return null;
    }

    const drawer = (
      <div>
        <div>
          <div>
            <List>
              <ListItem button key="Activity">
                <ListItemIcon>
                  <AccessTime />
                </ListItemIcon>
                <ListItemText>Activity</ListItemText>
              </ListItem>
              <ListItem button key="Settings">
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </ListItem>
            </List>
            <div>
              <Button
                onPress={this.handleOpenTrandactionModal}
                variant="outlined"
                title="new"
              />
              <TransactionModal
                web3={this.state.web3}
                transactionModalOpen={this.state.transactionModalOpen}
                handleTransactionModalClose={this.handleCloseTrandactionModal}
                handleTransactionSend={this.sendTransaction}
              />
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <Container>
        <SidebarContainer>
          <div>
            <AppBar position="fixed">
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="Open drawer"
                  onClick={this.handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" color="inherit" noWrap>
                  Paymo
                </Typography>
              </Toolbar>
            </AppBar>
            <nav>
              {/* The implementation can be swap with js to avoid SEO duplication of links. */}
              <Hidden smUp implementation="css">
                <Drawer
                  variant="temporary"
                  open={this.state.mobileOpen}
                  onClose={this.handleDrawerToggle}
                  ModalProps={{
                    keepMounted: true // Better open performance on mobile.
                  }}
                >
                  {drawer}
                </Drawer>
              </Hidden>
              <Hidden xsDown implementation="css">
                <Drawer variant="permanent" open>
                  {drawer}
                </Drawer>
              </Hidden>
            </nav>
            <main>
              <div />
              <Transactions
                account={this.state.accounts[0]}
                network={this.state.network}
              />
            </main>
          </div>
        </SidebarContainer>
      </Container>
    );
  }
}

ResponsiveDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default ResponsiveDrawer;
