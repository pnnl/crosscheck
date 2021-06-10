import React, {useState} from 'react'

import {scaleOrdinal} from 'd3-scale'
import {schemeCategory10} from 'd3-scale-chromatic'

import Tooltip from '@material-ui/core/Tooltip'

const colors = scaleOrdinal(schemeCategory10)

export const Highlight = ({compressed=false, textField='text', spansField='spans', style, ...props}) => {
  const text = props[textField] || '';
  const spans = Array.from(props[spansField] || [])
    .sort((a, b) => a.start - b.start);

  const ends = [];

  if (spans.length === 0) {
    return text;
  }

  return <span style={{lineHeight: '1.75em'}}>
    <span>{!compressed && text.slice(0, spans[0].start)}</span>
    { spans.map(({start, end, ...localProps}, i) => {
        if (ends.length === 0 || ends[ends.length - 1] < start) {
          ends.push(end);
          return <React.Fragment key={start}>
            { i > 0 && !compressed && text.slice(spans[i - 1].end, start)}
            { i > 0 && compressed && '...'}
            <Tooltip title={localProps.title}>
              <span
                style={{...style, ...localProps.style}}
              >
                {text.slice(start, end)}
              </span>
            </Tooltip>
          </React.Fragment>
        }
      })
    }
    <span>{!compressed && text.slice(spans[spans.length - 1].end)}</span>
  </span>

}

export function MultiHighlight({spansField=[], ...props}) {

  spansField = spansField.filter(d => d in props && props[d].length > 0);

  const [currentSpan, setCurrentSpan] = useState(spansField[0]);

  return <React.Fragment>
    <div>
      <Highlight {...props} spansField={currentSpan}/>
    </div>

    <div style={{marginTop: 4, fontSize: '.75em', fontStyle: 'italic'}}>
      { spansField.map(v =>
          <span
            style={{
                cursor: 'pointer',
                padding: 1,
                marginRight: 2,
                border: v === currentSpan ? '1px solid black' : '1px solid white'}}
            onClick={() => setCurrentSpan(v)}>
              {v}
          </span>
        )
      }
    </div>
  </React.Fragment>
}