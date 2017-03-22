import React, { Component } from 'react'
import logo from './logo.svg'
import styled, {keyframes} from 'styled-components'

const AppWrapper = styled.div`
  text-align: center;
  margin: 1em;
`

const List = styled.ul`
  margin: 0;
  list-style: none;
  padding: 0;
`

const JobGrid = styled(List)`
  display: grid;
  grid-template-columns: repeat(auto-fill, 100px);
  grid-auto-rows: 100px;
  grid-gap: 1em;
  justify-content: center;
`

const JobImg = styled.img`
  display: block;
`

const JobListItem = styled.li`
  grid-column: span 2;
  grid-row: span 1;
`

const JobBlock = styled.a`
  display: block;

  border-radius: 3px;
  overflow: hidden;

  transition: 0.2s;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14),
              0 1px 5px 0 rgba(0,0,0,0.12),
              0 3px 1px -2px rgba(0,0,0,0.2);

  &:focus {
    outline: 0;
  }

  &:hover, &:focus {
    box-shadow: 0 6px 10px 0 hsla(219, 50%, 20%, 0.14),
                0 1px 18px 0 hsla(219, 50%, 20%, 0.12),
                0 3px 5px -1px hsla(219, 50%, 20%, 0.3);
  }
`

const SearchInput = styled.input`
  outline: 0;
  margin-bottom: 1rem;

  border: 0;
  border-radius: 3px;
  font-size: 1rem;
  padding: 0.5em 0.75em;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14),
              0 1px 5px 0 rgba(0,0,0,0.12),
              0 3px 1px -2px rgba(0,0,0,0.2);

  &:focus {
    background-color: lightblue;
  }
`

const Icon = styled.span`
  display: inline-block;
  font-family: "Ionicons";
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  text-rendering: auto;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`

const SearchWrapper = styled.div``

const SearchOperatorsWrapper = styled.div`
  box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14),
              0 1px 5px 0 rgba(0,0,0,0.12),
              0 3px 1px -2px rgba(0,0,0,0.2);

  margin-bottom: 1rem;
`

const SingleSearchOperatorWrapper = styled.div`
  background-color: lightyellow;
`

const base = 'http://localhost:3000/pub/'
const database = `${base}/database.json`
const thumbs = `${base}/thumbnails/`

class JobItem extends React.PureComponent {
  render() {
    const job = this.props.job
    const link = `${job.year}/${job.title}`
    const featured = `${thumbs}/${link}/${encodeURIComponent(job.featured)}_400x400@2x.jpg`

    return <JobBlock href={`/${link}`}>
      <JobImg src={featured} width={400} />
      {/*<JobHeading>{job.title}</JobHeading>*/}
      {/*<pre><code>{JSON.stringify(job, null, 2)}</code></pre>*/}
    </JobBlock>
  }
}

class JobList extends React.PureComponent {
  render() {
    return <JobGrid>
      {this.props.jobs.map(j => <JobListItem key={j.id}><JobItem job={j} /></JobListItem>)}
    </JobGrid>
  }
}

class SearchBox extends React.PureComponent {
  onChange = event => {
    this.props.onChange(event.target.value)
  }

  render() {
    return <SearchInput onChange={this.onChange} value={this.props.text} />
  }
}

class Ionicon extends React.PureComponent {
  render() {
    const {name} = this.props
    return <Icon className={`ion-${name}`} />
  }
}

class SingleSearchOperator extends React.PureComponent {
  render() {
    return <SingleSearchOperatorWrapper>
      {this.props.operator.name}
    </SingleSearchOperatorWrapper>
  }
}

class SearchOperators extends React.PureComponent {
  onChange = event => {

  }

  render() {
    return <SearchOperatorsWrapper>
      {this.props.operators.map(op =>
        <SingleSearchOperator key={op.name} operator={op} />)}
    </SearchOperatorsWrapper>
  }
}

class JobSearch extends React.PureComponent {
  state = {
    searchText: '',
    jobs: [],
    operators: [{
      name: 'Size',
    }]
  }

  async componentWillMount() {
    let jobs = await fetch(database).then(r => r.json())
    this.setState(() => ({jobs}))
  }

  onSearch = text => {
    this.setState(() => ({searchText: text}))
  }

  onSearchOp = () => {
  }

  render() {
    const query = new RegExp(this.state.searchText, 'i')
    const jobs = this.state.jobs.filter(j => query.test(j.title))
    return <SearchWrapper>
      <SearchBox text={this.state.searchText} onChange={this.onSearch} />
      <SearchOperators operators={this.state.operators} onChange={this.onSearchOp} />
      <JobList jobs={jobs} />
    </SearchWrapper>
  }
}

class App extends Component {
  render() {
    return (
      <AppWrapper>
        <JobSearch />
      </AppWrapper>
    )
  }
}

export default App
