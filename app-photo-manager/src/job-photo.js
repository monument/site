import React from 'react'
import styled from 'styled-components'
import {Image} from './components'

const base = 'http://localhost:3001'

export default class JobPhoto extends React.PureComponent {
  render() {
    const {
      component = Image,
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
