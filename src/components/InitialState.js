import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components/native'

import { Button, Text } from '@morpheus-ui/core'
import { CircleArrowRight } from '@morpheus-ui/icons'
import applyContext from '../hocs/Context'
import screenSize from '../hocs/ScreenSize'

const Container = screenSize(styled.View`
  padding: 40px;
  width: 500px;
  ${props =>
    props.screenWidth <= 900 &&
    css`
      width: 400px;
    `};
  ${props =>
    props.screenWidth <= 600 &&
    css`
      width: 100%;
    `};
`)

const Description = screenSize(styled.View`
  margin-top: 10px;
  margin-bottom: ${props => props.theme.spacing};
  width: 100%;
`)

class InitialState extends React.Component {
  render() {
    return (
      <Container>
        <Text variant={['h2', 'h2Poppins']}>{'Welcome to Payments'}</Text>
        <Description>
          <Text variant="welcome">
            {
              'Start a new transfer and easily send funds to your contacts on Mainframe OS.'
            }
          </Text>
        </Description>
        <Button
          title="NEW TRANSFER"
          variant={['borderless']}
          Icon={CircleArrowRight}
          onPress={this.props.handleOpenTransactionModal}
        />
      </Container>
    )
  }
}

InitialState.propTypes = {
  handleOpenTransactionModal: PropTypes.func,
}

export default applyContext(InitialState)
