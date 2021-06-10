import React from 'react'

import { withStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge'
import Typography from '@material-ui/core/Typography'

import {min, max} from 'd3-array'

import {schemeCategory10} from 'd3-scale-chromatic'
import {scaleOrdinal} from 'd3-scale'

const color = scaleOrdinal(schemeCategory10);

const tags = ['LOC', 'MISC', 'ORG', 'PER'];

const tagColors = {};
tags.forEach(d =>
  tagColors[d] = color(d)
);

const StyledBadge = withStyles({
  badge: {
    height: '1.125em',
    right: 20
  }
})(Badge);

const spanStyle = {
  verticalAlign: 'bottom',
  paddingTop: 3
}

export const NERBadge = ({badgeContent, children}) =>
  <StyledBadge
    badgeContent={badgeContent}
    color='primary'
  >
    <span
      style={{
        fontWeight: 'bold',
        borderTop: 'solid 2px',
        borderColor: tagColors[badgeContent],
        borderRadius: 5,
        ...spanStyle
      }}
    >
      { children }
    </span>
  </StyledBadge>

const Sentence = ({start, end, sentence, tag}) =>
  tag === undefined
    ? <Typography variant='body'>
       { sentence }
      </Typography>
    : <Typography variant='body'>
        <span style={spanStyle}>
          { sentence.slice(0, start) }
        </span>

        <NERBadge badgeContent={tag}>
          { sentence.slice(start, end) }
        </NERBadge>

        <span style={spanStyle}>
          { sentence.slice(end) }
        </span>
      </Typography>

export const NERCombinedIcon = ({sent_idx, begin_idx, end_idx, agreement, sentence, token, ...props}) =>
  <div style={{width: 350, marginTop: 5, marginBottom: 5}}>
    <Sentence
      start={begin_idx}
      end={end_idx}
      sentence={sentence}
      tag={
        Array.from(new Set(Object.values(props)))
          .sort()
          .map(d => d.slice(0, 1))
          .join('')
      }/>
  </div>

export const NEREnsembleIcon = ({maxChars=70, sentence, token, ...props}) => {
  const ranges = Object.values(props)
    .filter(d => d.length);
  const minStart = min(ranges, d => d[0]);
  const maxEnd = max(ranges, d => d[1]);

  const adjustedStart = Math.max(0, maxEnd - maxChars);

  return <table style={{margin: 5}}><tbody>
    { Object.entries(props)
        .map(([key, values]) => { 
          const [start, end, tag] = values;
          return <tr key={key}>
            <td align='right' valign='bottom'>
              <Typography variant='caption'>
                {key}:
              </Typography>
            </td>

            <td>
              <Sentence
                sentence={sentence.slice(adjustedStart, adjustedStart + maxChars)}
                start={start - adjustedStart}
                end={end - adjustedStart}
                tag={tag}
              />
            </td>
          </tr>
        })
    }
  </tbody></table>
}