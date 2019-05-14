import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/native'
import applyContext from '../hocs/Context'
import Transactions from './Transactions'
import InitialState from './InitialState'

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.white};
  display: flex;
  flex-direction: row;
  padding: ${props => props.theme.spacing};
`

const TransactionsContainer = styled.View`
  width: 100%;
  overflow: scroll;
`

class MainContainer extends React.Component {
  render() {
    return (
      <Container>
        <TransactionsContainer>
          {this.props.initialState ? <InitialState /> : <Transactions />}
        </TransactionsContainer>
      </Container>
    )
  }
}

MainContainer.propTypes = {
  initialState: PropTypes.object,
}

export default applyContext(MainContainer)
