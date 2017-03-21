import React, { Component } from 'react'
import logo from './logo.svg'
import styled from 'styled-components'

const AppWrapper = styled.div`
  text-align: center;
`

const AppHeader = styled.div`
  background-color: #222;
  height: 150px;
  padding: 20px;
  color: white;
`

const Logo = styled.img`
  animation: App-logo-spin infinite 20s linear;
  height: 80px;
`

const Intro = styled.p`
  font-size: large;
`

const List = styled.ul`
  text-align: left;
  max-width: 40em;
  margin: 0 auto;
  padding: 0;
  list-style: none;
`

const JobGrid = styled(List)`
  display: grid;
  grid-template-columns: repeat(4, 150px);
  grid-column-gap: 1em;
`

const JobHeading = styled.h1`
  font-size: 1em;

  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const JobImg = styled.img`
  display: block;
`

const JobDetails = styled.details`

`

const Summary = styled.summary`
  cursor: pointer;

  &::-webkit-details-marker {
    display: none;
  }
`

const base = 'http://localhost:3000/pub/'
const database = `${base}/database.json`
const thumbs = `${base}/thumbnails/`

class JobItem extends React.PureComponent {
  render() {
    const job = this.props.job
    const featured = `${thumbs}/${encodeURIComponent(job.year)}/${encodeURIComponent(job.title)}/${encodeURIComponent(job.featured)}_320x400@2x.jpg`

    return <JobDetails>
      <Summary>
        <JobHeading>{job.title}</JobHeading>
        <JobImg src={featured} width={400} />
      </Summary>
      <pre><code>{JSON.stringify(job, null, 2)}</code></pre>
    </JobDetails>
  }
}

class JobList extends React.PureComponent {
  constructor() {
    super()
    this.state = {jobs: []}
  }

  async componentWillMount() {
    let jobs = await fetch(database).then(r => r.json())
    this.setState({jobs})
  }

  render() {
    return <JobGrid>
      {this.state.jobs.map(j => <li key={j.id}><JobItem job={j} /></li>)}
    </JobGrid>
  }
}

class App extends Component {
  render() {
    return (
      <AppWrapper>
        <AppHeader>
          <Logo src={logo} alt="logo" />
          <h2>Welcome to React</h2>
        </AppHeader>
        <Intro>
          To get started, edit <code>src/App.js</code> and save to reload.
        </Intro>
        <JobList />
      </AppWrapper>
    )
  }
}

export default App
