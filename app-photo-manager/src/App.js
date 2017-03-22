import React, {Component} from 'react'
import styled from 'styled-components'
import fuzzy from 'fuzzysearch'
import {BrowserRouter, Route, Link} from 'react-router-dom'

import {List, Image} from './components'
import {shadow1, shadow2} from './mixins'

const AppWrapper = styled.div`
  text-align: center;
  margin: 1em;
`

const JobGrid = styled(List)`
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px);
  grid-auto-rows: 200px;
  grid-gap: 1em;
  justify-content: center;
`

const JobListItem = styled.li`
`

const shadowedBlock = `
  border-radius: 3px;
  overflow: hidden;
  ${shadow1}
`

const JobBlock = styled(Link)`
  display: block;
  transition: 0.2s;
  ${shadowedBlock}

  &:focus {
    outline: 0;
  }

  &:hover, &:focus {
    ${shadow2}
  }
`

const JobDetailImage = styled.img`
  display: block;
  ${shadowedBlock}
`

const JobInfoWrapper = styled.div`
  display: grid;
  grid-template: "title title title" "photos json info";
`

const SearchInput = styled.input`
  outline: 0;

  border: 0;
  ${shadowedBlock}
  margin-bottom: 1rem;
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

const JobWrapper = styled.div`
  padding: 1em;
  background-color: white;
  ${shadowedBlock}
`

const JobHeading = styled.h1``

const base = 'http://localhost:3001'
const database = `${base}/jobs`

class JobPhoto extends React.PureComponent {
  render() {
    const {
      component=Image,
      year,
      title,
      size = '400x400',
      imageName,
    } = this.props

    const eyear = encodeURIComponent(year)
    const etitle = encodeURIComponent(title)

    const filename = imageName
      ? `photo/${encodeURIComponent(imageName)}`
      : 'featured'

    const url = `${base}/job/${eyear}/${etitle}/${filename}/${size}`

    const Img = component

    return <Img srcSet={`${url}, ${url}/@2x 2x`} />
  }
}

class JobItem extends React.PureComponent {
  render() {
    const job = this.props.job
    const url = `/job/${encodeURIComponent(job.year)}/${encodeURIComponent(job.title)}`

    return (
      <JobBlock to={url}>
        <JobPhoto component={Image} year={job.year} title={job.title} />
        {/*<JobHeading>{job.title}</JobHeading>*/}
        {/*<pre><code>{JSON.stringify(job, null, 2)}</code></pre>*/}
      </JobBlock>
    )
  }
}

class JobList extends React.PureComponent {
  render() {
    return (
      <JobGrid>
        {this.props.jobs.map(j => (
          <JobListItem key={j.id}><JobItem job={j} /></JobListItem>
        ))}
      </JobGrid>
    )
  }
}

class SearchBox extends React.PureComponent {
  onChange = event => {
    this.props.onChange(event.target.value)
  };

  render() {
    return <SearchInput onChange={this.onChange} value={this.props.text} />
  }
}


const Ionicon = ({name}) => <Icon className={`ion-${name}`} />

class SingleSearchOperator extends React.PureComponent {
  render() {
    return (
      <SingleSearchOperatorWrapper>
        {this.props.operator.name}
      </SingleSearchOperatorWrapper>
    )
  }
}

class SearchOperators extends React.PureComponent {
  onChange = event => {};

  render() {
    return (
      <SearchOperatorsWrapper>
        {this.props.operators.map(op => (
          <SingleSearchOperator key={op.name} operator={op} />
        ))}
      </SearchOperatorsWrapper>
    )
  }
}

class JobSearch extends React.PureComponent {
  state = {
    searchText: '',
    jobs: [],
    operators: [
      {
        name: 'Size',
      },
    ],
  };

  async componentWillMount() {
    const jobs = await fetch(database).then(r => r.json())
    this.setState(() => ({jobs}))
  }

  onSearch = text => {
    this.setState(() => ({searchText: text}))
  };

  onSearchOp = () => {};

  render() {
    const query = this.state.searchText.toLowerCase()
    const jobs = this.state.jobs.filter(
      j =>
        fuzzy(query, j.title.toLowerCase()) ||
        Object.values(j.info)
          .map(v => Array.isArray(v) ? v.join(', ') : v)
          .filter(v => v)
          .map(v => v.toLowerCase())
          .some(v => fuzzy(query, v))
    )

    return (
      <SearchWrapper>
        <SearchBox text={this.state.searchText} onChange={this.onSearch} />
        <SearchOperators
          operators={this.state.operators}
          onChange={this.onSearchOp}
        />
        <JobList jobs={jobs} />
      </SearchWrapper>
    )
  }
}

class JobPhotoList extends React.PureComponent {
  render() {
    const {job, style} = this.props
    return (
      <List style={style}>
        {job.photos.map(p => (
          <li key={p.filename} style={{marginBottom: '1em'}}>
            <JobPhoto
              component={JobDetailImage}
              year={job.year}
              title={job.title}
              imageName={p.filename}
              size='400'
            />
          </li>
        ))}
      </List>
    )
  }
}

class JobInfo extends React.PureComponent {
  render() {
    const {job} = this.props
    return this.props.job
      ? <JobInfoWrapper>
          <JobHeading style={{gridArea: 'title'}}>{job.title}</JobHeading>
          <span>{JSON.stringify(job, null, 2)}</span>
          <JobPhotoList style={{gridArea: 'photos'}} job={job} />
        </JobInfoWrapper>
      : <span>Loading…</span>
  }
}

class JobDetail extends React.PureComponent {
  state = {
    job: null,
  };

  async componentWillMount() {
    const {match} = this.props
    const {year, title} = match.params
    const job = await fetch(`${base}/job/${year}/${title}`).then(r => r.json())
    this.setState(() => ({job}))
  }

  render() {
    return (
      <JobWrapper>
        <JobInfo job={this.state.job} />
      </JobWrapper>
    )
  }
}

class App extends Component {
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
