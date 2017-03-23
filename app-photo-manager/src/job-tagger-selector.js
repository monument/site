import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div``
const Contents = styled.div``
const Warning = styled.p``

const Option = styled.label`
  ${props => props.selected ? 'a' : 'b'}
`

export default class Selector extends React.PureComponent {
  render() {
    let {type, label, selected, options = [], onChange, warning} = this.props
    let inputType = type === 'and' ? 'checkbox' : 'radio'

    const opts = options.map(val => {
      let isChecked = Array.isArray(selected)
        ? selected.includes(val)
        : val === selected

      return (
        <Option key={val} selected={isChecked}>
          <input
            type={inputType}
            value={val}
            name={label}
            checked={isChecked}
            onChange={onChange}
          />
          <p>{val}</p>
        </Option>
      )
    })

    return (
      <Wrapper>
        <h2>{label}</h2>
        <Contents>
          {warning ? <Warning>{warning}</Warning> : opts}
        </Contents>
      </Wrapper>
    )
  }
}
