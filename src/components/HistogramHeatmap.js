import React from 'react'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'

import {scaleLinear, scaleOrdinal} from 'd3-scale'

import * as colorSchemes from 'd3-scale-chromatic'

//

import {getInHierarchy} from '../util'

import InstanceDrawer from './InstanceDrawer'

import {AggregationWrapper, Facet, smartFontColor} from './Heatmap'

import {innerColor, outerColor} from './Histogram'

import NormalizationToolbar from './NormalizationToolbar'

import {autoFormat} from '../util/formatting'

import './HistogramHeatmap.css'

const xAxisStyle = barWidth => ({
  width: (barWidth - 2)/2,
  display: 'inline-block',
  fontSize: '.75em',
});

const HistogramCell = ({uniques, tree, values, row, col, normLevel, normBy, colors, onClick, barWidth=60, bottom, showValuesInBars=false}) => {
  const normNode = getInHierarchy(
    tree, ...[col, row].slice(0, normLevel)
  );

  const rightTickValue = normNode ? normNode.value_max : 1;

  const scale = scaleLinear()
    .domain([0, normNode ? normNode.value_max : 1])
    .range([0, barWidth]);

  const marginTop = 1;
  const minHeight = barWidth/uniques[values].length - marginTop;

  const showBottomAxis = normLevel === 2 || normLevel <= 1 && bottom;

  return <td
    className='nlpvis-cell'
  >
    <div style={{border: 'solid 1px darkgray'}}>
      { uniques[values].map(value => {
          const node = getInHierarchy(tree, col, row, value);
          const v = node ? node.value : 0;

          return <Tooltip
            title={autoFormat(v)}
            placement='right'
          >
            <div
              className='nlpvis-bar'
              alt={value}
              style={{width: barWidth}}
              onClick={() => node && onClick && onClick(node.data.values)}
            >
              <Typography
                key={value}
                style={{
                  width: scale(v),
                  backgroundColor: colors(value),
                  color: smartFontColor(colors(value)),
                  fontSize: '.75em',
                  textAlign: 'right',
                  minHeight, marginTop
                }}
              >
                <div style={{paddingRight: 3}}>
                  { showValuesInBars && autoFormat(v) }
                </div>
              </Typography>
            </div>
          </Tooltip>
        })
      }
    </div>

    { showBottomAxis &&
      <div style={{marginTop: 3, height: '1.5em'}}>
        <div style={{width: barWidth, border: '1px solid darkgray', height: 5, borderBottom: 'none'}}>
          <Typography style={{...xAxisStyle(barWidth), textAlign: 'left'}}>
            { 0 }
          </Typography>

          <Typography style={{...xAxisStyle(barWidth), textAlign: 'right'}}>
            { autoFormat(rightTickValue) }
          </Typography>
        </div>
      </div>
    }

  </td>
}

const Legend = ({title, colors}) =>
  <table className='nlpvis-legend'>
    <thead>
      <tr>
        <th colSpan={2}>
          <Typography variant='headline'>
            {title}
          </Typography>
        </th>
      </tr>
    </thead>

    <tbody>
      { colors.domain().map(d =>
          <tr key={d}>
            <td style={{width: '1.25em'}}>
              <div
                style={{
                  width: '1em',
                  minHeight: '1em',
                  backgroundColor: colors(d)
                }}
              />
            </td>

            <td>
              <Typography>
                {d}
              </Typography>
            </td>
          </tr>
        )
      }
    </tbody>
  </table>

const createColorScale = (schemeName, domain, defaultColor=innerColor) => {
  const n = domain.length;

  if (schemeName === undefined || n <= 1) {
    return scaleOrdinal(domain.map(() => defaultColor))
      .domain(domain);
  }

  const scheme = colorSchemes[schemeName];

  if (typeof scheme[0] === 'string') {
    return scaleOrdinal(scheme)
      .domain(domain);
  }

  if (!(n in scheme)) {
    if (n === 2 && 3 in scheme) {
      return scaleOrdinal([scheme[3][0], scheme[3][2]])
        .domain(domain)
    } else {
      console.warn(`I don't know how to create a color scheme for ${schemeName} with n=${n}`)
      return () => defaultColor;
    }
  }

  return scaleOrdinal(scheme[n])
    .domain(domain);
}

const HistogramHeatmapInner = ({scheme, notes, onChangeNormLevel, onChangeNote, colorDomain, ...props}) => {
  const {uniques, values, data, normLevel} = props;

  const colors = createColorScale(scheme, colorDomain || uniques[values]);

  return <div className='nlpvis-histogram-heatmap'>
    <Grid container spacing={16}>
      <Grid item>
        <InstanceDrawer
          onChangeNote={onChangeNote}
          notes={notes}
          {...props}
        >
          <Facet colors={colors} {...props}>
            <HistogramCell/>
          </Facet>
        </InstanceDrawer>
      </Grid>

      <Grid item>
        <Legend title={values} colors={colors}/>
        <NormalizationToolbar
          selection={normLevel}
          onClick={onChangeNormLevel}
        />
      </Grid>

    </Grid>
  </div>

}

export class HistogramHeatmap extends React.Component {
  state = {
    normLevel: 0,
    transposed: false
  }

  handleChangeNormLevel = normLevel =>
    this.setState({normLevel})

  handleChangeTranspose = () =>
    this.setState({transposed: !this.state.transposed})

  render() {
    return<AggregationWrapper {...this.state} {...this.props}>
      <HistogramHeatmapInner
        onChangeNormLevel={this.handleChangeNormLevel}
        onChangeTranspose={this.handleChangeTranspose}
      />
    </AggregationWrapper>
  }
}


  

