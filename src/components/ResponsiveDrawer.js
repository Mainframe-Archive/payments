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
      ${props =>
        props.open &&
        css`
          height: 100vh;
        `};
    `};
`);

const SidebarContainer = screenSize(styled.View`
  width: 100%;
  background-color: ${props => props.theme.gray};
  ${props =>
    props.screenWidth <= 900 &&
    !props.open &&
    css`
      display: none;
    `};
  ${props =>
    props.screenWidth <= 900 &&
    props.open &&
    css`
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
      margin-top: 40px;
    `};
`);

const NavItem = screenSize(styled.View`
  width: 100%;
  diplay: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 10px 0;
  ${props =>
    props.screenWidth <= 900 &&
    css`
      justify-content: center;
    `}
`);

const Triangle = screenSize(styled.View`
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
  ${props =>
    props.screenWidth <= 900 &&
    css`
      display: none;
    `}
`);

const NavTextContainer = screenSize(styled.TouchableOpacity`
  margin-left: 20px;
  ${props =>
    props.screenWidth <= 900 &&
    css`
      margin-left: 0;
    `}
`);

const ButtonContainer = styled.View`
  padding: ${props => props.theme.spacing};
  margin: 0 auto;
`;

const ResponsiveButton = screenSize(styled.View`
  display: none;
  ${props =>
    props.screenWidth <= 900 &&
    css`
      display: block;
      position: absolute;
      right: 0;
    `};
  ${props =>
    props.open &&
    css`
      transform: rotate(45deg);
    `};
`);

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
        <Container open={this.state.mobileOpen}>
          <ResponsiveButton open={this.state.mobileOpen}>
            <Button
              onPress={this.handleDrawerToggle}
              variant={['borderless', 'borderlessMobile']}
              Icon={PlusSymbol}
            />
          </ResponsiveButton>
          <SidebarContainer open={this.state.mobileOpen}>
            {drawer}
          </SidebarContainer>
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
