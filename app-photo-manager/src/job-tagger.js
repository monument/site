import React from 'react'
import startCase from 'lodash/startCase'
import Selector from './job-tagger-selector'

import * as config from './job-tagger-options'

export default class JobTagger extends React.PureComponent {
  render() {
    const {job, style, className, onChangeMetadata} = this.props
    if (!job) {
      return null
    }

    const {category, material, size} = job.info

    return (
      <form style={style} className={className}>
        <Selector
          type="or"
          label="Category"
          selected={category}
          options={config.categories}
          onChange={onChangeMetadata('category')}
        />

        <Selector
          type="or"
          label="Material"
          selected={material}
          options={config.materials}
          onChange={onChangeMetadata('material')}
        />

        <Selector
          type="or"
          label="Size"
          selected={size}
          options={config.sizes}
          onChange={onChangeMetadata('size')}
        />

        {config.detailList.map(key => {
          if (!material) {
            return null
          }
          const materialOptions = config.details[material.toLowerCase()]
          const possibilities = materialOptions[key]

          const type = possibilities.$type
          let options = possibilities.$options

          if (possibilities.$dependsOn) {
            let dependsOn = job.info[possibilities.$dependsOn]
            if (dependsOn) {
              dependsOn = dependsOn.toLowerCase()
            }
            options = possibilities[dependsOn]
          }

          if (!options) {
            options = null
          }

          return (
            <Selector
              key={key}
              type={type}
              label={startCase(key)}
              selected={job.info[key.toLowerCase()]}
              onChange={onChangeMetadata(key)}
              options={options}
              warning={
                !options && possibilities.$dependsOn
                  ? `Please select a ${possibilities.$dependsOn.toLowerCase()}`
                  : false
              }
            />
          )
        })}
      </form>
    )
  }
}
