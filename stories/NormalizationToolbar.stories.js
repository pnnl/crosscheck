import React from 'react';

import { storiesOf } from '@storybook/react'

//

import NormalizationToolbar from '../src/components/NormalizationToolbar'

storiesOf('Normalization Toolbar', module)
  .add('default', () =>
    <NormalizationToolbar
      onClick={console.log}
    />
  )
  .add('with selection', () =>
    <NormalizationToolbar
      onClick={console.log}
      selection={1}
    />
  )
