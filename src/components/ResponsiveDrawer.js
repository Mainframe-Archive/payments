import React from 'react';
import PropTypes from 'prop-types';
import TransactionModal from './TransactionModal';

import styled, { css } from 'styled-components/native';
import { Button, Text } from '@morpheus-ui/core';
import { Image } from 'react-native-web';
import { PlusSymbolSm } from '@morpheus-ui/icons';
import screenSize from '../hocs/ScreenSize';
import applyContext from '../hocs/Context';

const PositionContainer = styled.View`
  position: relative;
`;

const Container = screenSize(styled.View`
  width: 207px;
  height: 100%;
  background-color: ${props => props.theme.gray};
  display: flex;
  flex-direction: row;
`);

const SidebarContainer = screenSize(styled.View`
  width: 100%;
  background-color: ${props => props.theme.gray};
`);

const NavItem = screenSize(styled.View`
  width: 100%;
  diplay: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 7px 0;
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
`);

const NavTextContainer = screenSize(styled.TouchableOpacity`
  margin-left: 17px;
`);

const ButtonContainer = styled.View`
  padding: ${props => props.theme.spacing};
  margin: 0 auto;
  ${props =>
    props.open &&
    css`
      display: none;
    `}
`;

const TestNet = screenSize(styled.View`
  display: flex;
  flex-direction: row;
  position: absolute;
  bottom: 10px;
  left: 10px;
  width: 120px;
`);

const TestNetText = screenSize(styled.View`
  margin-left: 7px;
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
            variant={['green', 'hover-shadow', 'size150']}
            title="NEW TRANSFER"
            Icon={PlusSymbolSm}
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
        {/*<NavItem>
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
        </NavItem>*/}
        <TransactionModal />
      </>
    );

    return (
      <PositionContainer>
        <Container>
          <SidebarContainer>{drawer}</SidebarContainer>
          <TestNet>
            <Image
              source={require('../img/testnet.svg')}
              style={{ width: 14, height: 14 }}
            />
            <TestNetText>
              <Text variant={['faded']}>
                {this.props.network === '3'
                  ? 'running on Testnet'
                  : 'please connect to Testnet'}
              </Text>
            </TestNetText>
          </TestNet>
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
};

export default applyContext(ResponsiveDrawer);
