import React from 'react'
import styled from 'styled-components'
import {List, Image} from './components'
import {shadowedBlock} from './mixins'

import JobPhoto from './job-photo'
import JobTagger from './job-tagger'

const base = 'http://localhost:3001'

const JobWrapper = styled.div`
  padding: 1em;
  background-color: white;
  ${shadowedBlock}
`

const JobHeading = styled.h1`
  text-align: center;
`

const JobDetailImage = styled(Image)`
  ${shadowedBlock}
`

const JobInfoWrapper = styled.div`
  text-align: left;
  display: grid;
  grid-template:
    "title title title"
    "photos json info";
  grid-template-columns: 400px 1fr 1fr;
  grid-gap: 1em;
`

class JobInfoEditor extends React.PureComponent {
  render() {
    const {job, style} = this.props
    return (
      <List style={style}>
        {Object.entries(job.info).map(([k, v]) => <li key={k}>{k}: {v}</li>)}
      </List>
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
              size="400"
            />
            <span
              style={{
                display: 'block',
                margin: '0.5em 0',
                whiteSpace: 'pre-wrap',
              }}
            >
              {JSON.stringify(p, null, 2)}
            </span>
          </li>
        ))}
      </List>
    )
  }
}

class JobInfo extends React.PureComponent {
  state = {
    job: this.props.job,
  };

  onChange = ev => console.log(ev);

  render() {
    const {job} = this.props
    return job
      ? <JobInfoWrapper>
          <JobHeading style={{gridArea: 'title'}}>{job.title}</JobHeading>
          <span style={{gridArea: 'json', whiteSpace: 'pre-wrap'}}>
            {JSON.stringify(job, null, 2)}
          </span>
          <JobPhotoList style={{gridArea: 'photos'}} job={job} />
          <JobTagger
            style={{gridArea: 'info'}}
            job={job}
            onChangeMetadata={this.onChange}
          />
        </JobInfoWrapper>
      : <span>Loading…</span>
  }
}

export default class JobDetail extends React.PureComponent {
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
