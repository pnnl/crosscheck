import React from 'react'

import Grid from '@material-ui/core/Grid'

import ReactJson from 'react-json-view'

const default_src = 'https://upload.wikimedia.org/wikipedia/en/f/f7/RickRoll.png';

export const Image = ({src=default_src, ...props}) =>
  <div>
    <img src={src} width={300}/>
    <ReactJson
      collapsed
      enableClipboard={({src}) =>
        navigator.clipboard.writeText(JSON.stringify(src, null, 2))
      }
      src={props}
    />
  </div>