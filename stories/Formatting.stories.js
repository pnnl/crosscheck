import React from 'react';

import { storiesOf } from '@storybook/react';

// 

import {autoFormat} from '../src/util/formatting'

const TestFormat = ({value}) =>
  <div>
    {autoFormat(value)}
  </div>

storiesOf('Formatting', module)
  .add('simple word', () =>
    <TestFormat value='hi' />
  )
  .add('numbers', () =>
    <TestFormat value={123.456} />
  )
  .add('words with dash', () =>
    <TestFormat value='herp-a-derp' />
  )