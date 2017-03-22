import React from 'react'
import styled from 'styled-components'
import {List, Image} from './components'
import {shadowedBlock} from './mixins'

import JobPhoto from './job-photo'

const base = 'http://localhost:3001'

const JobWrapper = styled.div`
  padding: 1em;
  background-color: white;
  ${shadowedBlock}
`

const JobHeading = styled.h1``


const JobDetailImage = styled(Image)`
  ${shadowedBlock}
`

const JobInfoWrapper = styled.div`
  display: grid;
  grid-template: "title title title" "photos json info";
`

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
