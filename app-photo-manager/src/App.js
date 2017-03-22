import React from 'react'
import styled from 'styled-components'
import {BrowserRouter, Route} from 'react-router-dom'

import JobSearch from './job-search'
import JobDetail from './job-detail'

const AppWrapper = styled.div`
  text-align: center;
  margin: 1em;
`

class App extends React.PureComponent {
  render() {
    return (
      <BrowserRouter>
        <AppWrapper>
          <Route exact path="/" component={JobSearch} />
          <Route path="/job/:year/:title" component={JobDetail} />
        </AppWrapper>
      </BrowserRouter>
    )
  }
}

export default App
