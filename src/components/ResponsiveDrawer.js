import React from 'react'
import PropTypes from 'prop-types'
import TransactionModal from './TransactionModal'

import styled, { css } from 'styled-components/native'
import { Button, Text } from '@morpheus-ui/core'
import { PlusSymbol } from '@morpheus-ui/icons'
import screenSize from '../hocs/ScreenSize'
import applyContext from '../hocs/Context'

const Container = screenSize(styled.View`
  width: 250px;
  height: 100%;
  background-color: ${props => props.theme.gray};
  display: flex;
  flex-direction: row;

  ${props =>
    props.screenWidth <= 900 &&
    css`
      width: 150px;
    `};
`)

const SidebarContainer = screenSize(styled.View`
  width: 100%;
  background-color: ${props => props.theme.gray};
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
`)

const NavItem = styled.View`
  width: 100%;
  diplay: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: ${props => props.theme.spacing} 0;
`

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
`

const NavTextContainer = styled.TouchableOpacity`
  margin-left: 20px;
`

const ButtonContainer = styled.View`
  padding: ${props => props.theme.spacing};
  margin: 0 auto;
`

class ResponsiveDrawer extends React.Component {
  state = {
    mobileOpen: false,
    transactionModalOpen: false,
    activeNav: 'activity',
  }

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }))
  }

  handleOpenTrandactionModal = () => {
    this.setState({ transactionModalOpen: true })
  }

  handleCloseTrandactionModal = () => {
    this.setState({ transactionModalOpen: false })
  }

  printTransactionHash = transactionHash => {
    console.log('transactionHash: ', transactionHash)
    this.setState({ transactionHash, transactionModalOpen: false })
  }

  printReceipt(receipt) {
    console.log('receipt: ', receipt)
  }

  printConfNumber(confNumber, receipt) {
    console.log('confNumber: ', confNumber, receipt)
  }

  logError(error) {
    console.error('ERROR: ', error)
  }

  render() {
    const { web3 } = this.props

    if (web3) {
      this.props.getBlockchainData()
    } else {
      return null
    }

    const drawer = (
      <>
        <ButtonContainer>
          <Button
            onPress={this.handleOpenTrandactionModal}
            variant="outlined"
            title="NEW TRANSFER"
            Icon={PlusSymbol}
          />
        </ButtonContainer>
        <NavItem>
          <Triangle active={this.state.activeNav === 'activity'} />
          <NavTextContainer>
            <Text variant="h3">{'Activity'}</Text>
          </NavTextContainer>
        </NavItem>
        <NavItem>
          <Triangle active={this.state.activeNav === 'settings'} />
          <NavTextContainer>
            <Text variant="h3">{'Settings'}</Text>
          </NavTextContainer>
        </NavItem>
        <TransactionModal
          web3={web3}
          transactionModalOpen={this.state.transactionModalOpen}
          handleTransactionModalClose={this.handleCloseTrandactionModal}
          handleTransactionSend={this.props.sendTransaction}
        />
      </>
    )

    return (
      <Container>
        <SidebarContainer>{drawer}</SidebarContainer>
      </Container>
    )
  }
}

ResponsiveDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
}

export default applyContext(ResponsiveDrawer)
