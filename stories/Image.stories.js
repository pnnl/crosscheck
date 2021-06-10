import React from 'react'

import { storiesOf } from '@storybook/react';

import Instance from '../src/instances' 

const data = {
  never: {gonna: {give: {you: 'up'}}}

};

const default_src = 'RickRoll.png';

storiesOf('Instances', module)
  .add('Image', () =>
    <Instance component='Image' {...data}/>
  )
  .add('img', () =>
    <Instance component='img'
    prefix='https://upload.wikimedia.org/wikipedia/en/f/f7'
    id={default_src}
	suffix=''/>
  )
