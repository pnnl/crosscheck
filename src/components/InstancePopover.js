import React from 'react'

import SimplePopover from './SimplePopover'
import Instance from '../instances'

const InstanceList = ({component, content=[], examples={}, nExamples=5}) =>
  <div>
    { content
        .filter(i => i in examples)
        .slice(0, nExamples)
        .map(i => <Instance key={i} component={component} {...examples[i]} />)
    }
  </div>

const InstancePopover = ({children, ...props}) =>
  <SimplePopover
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    content={
      <InstanceList {...props}/>
    }
  >
    {children}
  </SimplePopover>

export default InstancePopover