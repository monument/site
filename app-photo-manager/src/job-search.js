import React from 'react'
import styled from 'styled-components'
import fuzzy from 'fuzzysearch'
import {List} from './components'
import {shadowedBlock, shadow2} from './mixins'
import {Link} from 'react-router-dom'

import JobPhoto from './job-photo'

const JobGrid = styled(List)`
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px);
  grid-auto-rows: 200px;
  grid-gap: 1em;
  justify-content: center;
`

const JobListItem = styled.li``

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

const SearchInput = styled.input`
  outline: 0;
  width: 250px;

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

const SearchWrapper = styled.div``

const base = 'http://localhost:3001'

class JobItem extends React.PureComponent {
  render() {
    const job = this.props.job
    const url = `/job/${encodeURIComponent(job.year)}/${encodeURIComponent(job.title)}`

    return (
      <JobBlock to={url}>
        <JobPhoto year={job.year} title={job.title} />
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
    return (
      <SearchInput
        placeholder="Search"
        onChange={this.onChange}
        value={this.props.text}
      />
    )
  }
}

export default class JobSearch extends React.PureComponent {
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
    const jobs = await fetch(`${base}/jobs`).then(r => r.json())
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
        <JobList jobs={jobs} />
      </SearchWrapper>
    )
  }
}
