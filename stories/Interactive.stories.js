import React from 'react';

import { storiesOf } from '@storybook/react'

//

import props from './props.json'
import tableProps from './table-props.json'

import {Table, Heatmap, HistogramHeatmap} from '../src/'

storiesOf('Interactive Components', module)
  .add('Table', () =>
    <Table {...tableProps} />
  )
  .add('Heatmap', () =>
    <Heatmap
      {...props}
    />
  )
  .add('HistogramHeatmap', () =>
    <HistogramHeatmap
      {...props}
    />
  )
