import React from 'react';
import PropTypes from 'prop-types';
import TransactionModal from './TransactionModal';

import styled, { css } from 'styled-components/native';
import { Button, Text } from '@morpheus-ui/core';
import { PlusSymbol } from '@morpheus-ui/icons';
import screenSize from '../hocs/ScreenSize';
import applyContext from '../hocs/Context';

const PositionContainer = styled.View`
  position: relative;
`;

const Container = screenSize(styled.View`
  width: 250px;
  height: 100%;
  background-color: ${props => props.theme.gray};
  display: flex;
  flex-direction: row;

  ${props =>
    props.screenWidth <= 900 &&
    css`
      width: 100%;
      height: 50px;
      display: block;
      top: 0;
      left: 0;
      right: 0;
    `};
`);

const SidebarContainer = screenSize(styled.View`
  width: 100%;
  background-color: ${props => props.theme.gray};
  ${props =>
    props.screenWidth <= 900 &&
    css`
      display: none;
    `};
`);

const NavItem = styled.View`
  width: 100%;
  diplay: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 10px 0;
`;

const Triangle = styled.View`
  width: 0;
  height: 0;
  left: 0;
  border-top: 12px solid transparent;
  border-bottom: 12px solid transparent;
  border-left: 12px solid ${props => props.theme.paymentGreen};
  ${props =>
    !props.active &&
    css`
      border-left: 12px solid transparent;
    `}
`;

const NavTextContainer = styled.TouchableOpacity`
  margin-left: 20px;
`;

const ButtonContainer = styled.View`
  padding: ${props => props.theme.spacing};
  margin: 0 auto;
`;

class ResponsiveDrawer extends React.Component {
  state = {
    mobileOpen: false,
    activeNav: 'activity',
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  updateActiveNav = whichNav => {
    this.setState({ activeNav: whichNav });
  };

  render() {
    const { web3, getBlockchainData, handleOpenTransactionModal } = this.props;

    if (web3) {
      getBlockchainData();
    } else {
      return null;
    }
    const drawer = (
      <>
        <ButtonContainer>
          <Button
            onPress={handleOpenTransactionModal}
            variant={['green', 'hover-shadow']}
            title="NEW TRANSFER"
            Icon={PlusSymbol}
          />
        </ButtonContainer>
        <NavItem>
          <Triangle active={this.state.activeNav === 'activity'} />
          <NavTextContainer onPress={() => this.updateActiveNav('activity')}>
            <Text
              variant={
                this.state.activeNav === 'activity' ? 'h3' : ['h3', 'faded']
              }
            >
              {'Activity'}
            </Text>
          </NavTextContainer>
        </NavItem>
        <NavItem>
          <Triangle active={this.state.activeNav === 'settings'} />
          <NavTextContainer onPress={() => this.updateActiveNav('settings')}>
            <Text
              variant={
                this.state.activeNav === 'settings' ? 'h3' : ['h3', 'faded']
              }
            >
              {'Settings'}
            </Text>
          </NavTextContainer>
        </NavItem>
        <TransactionModal />
      </>
    );

    return (
      <PositionContainer>
        <Container>
          <SidebarContainer>{drawer}</SidebarContainer>
        </Container>
      </PositionContainer>
    );
  }
}

ResponsiveDrawer.propTypes = {
  getBlockchainData: PropTypes.func.isRequired,
  transactionModalOpen: PropTypes.bool.isRequired,
  handleCloseTransactionModal: PropTypes.func.isRequired,
  handleOpenTransactionModal: PropTypes.func.isRequired,
  sendTransaction: PropTypes.func.isRequired,
};

export default applyContext(ResponsiveDrawer);
