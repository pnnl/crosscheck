import React from 'react'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import TransposeIcon from '@material-ui/icons/Autorenew'

import {merge, rollup, extent, sum, cross} from 'd3-array'
import {hsl} from 'd3-color'
import {scaleSequential} from 'd3-scale'
import * as colorInterpolaters from 'd3-scale-chromatic'
import {scaleLinear, scaleQuantize} from 'd3-scale'

//

export const smartFontColor = backgroundColor =>
  hsl(backgroundColor).l < .45 ? 'white' : 'black'

import {description, groupby, getInHierarchy, asHierarchy} from '../util'

import InstanceDrawer from './InstanceDrawer'

import {autoFormat} from '../util/formatting'

import {compareRange} from '../util'

import NormalizationToolbar from './NormalizationToolbar'

// import './Heatmap.css'

const styles = {
  td: {
    textAlign: 'center',
    width: 40,
    height: 40
  },
  count: {
    fontWeight: 'bold'
  },
  percent: {
    fontSize: '.75em',
    fontStyle: 'italic'
  }
};

const HeatmapCell = ({tree, row, col, value, pct, normLevel=0, normBy='value', onClick, interpolate='interpolateGreens', ...props}) => {
  const node = getInHierarchy(tree, col, row, value);

  if (node === undefined) {
    return <td style={styles.td}/>
  }

  const normNode = getInHierarchy(tree, ...[col, row].slice(0, normLevel));

  const backgroundColor = scaleSequential(colorInterpolaters[interpolate])
    .domain([
      normNode[`${normBy}_min`],
      normNode[`${normBy}_max`]
    ])
    (node[normBy]);

  return <td
    style={{
      ...styles.td,
      backgroundColor,
      color: smartFontColor(backgroundColor)
    }}
    onClick={d => onClick && onClick(node.data.values)}
  >
    <div style={styles.count}>{autoFormat(node.value)}</div>
    { props.values !== '' &&
      <div style={styles.percent}>{Math.round(100*node.pct)}%</div>
    }
  </td>
}

const sizeof = d => d.length;

export class Facet extends React.Component {
  render() {
    const {
      uniques,
      rows,
      cols,
      groups,
      minSpacing=3,
      maxSpacing=20,
      onChangeTranspose,
      children,
      ...props
    } = {...this.state, ...this.props};

    const {normLevel} = props;
    // const rowSpacing = normLevel < 2 ? minSpacing : maxSpacing;
    const rowSpacing = minSpacing;
    const colSpacing = normLevel < 1 ? minSpacing : maxSpacing;

    const rowValues = uniques[rows];
    const colValues = uniques[cols];

    return <table
      style={{
        display: 'inline-block',
        borderSpacing: `${colSpacing}px ${rowSpacing}px`
      }}
    >
      <thead>
        <tr>
          <th colSpan={2} rowSpan={2}>
            { props.values !== '' &&
              <Typography variant='headline'>
                { props.value && `${props.values} = ${props.value}`}
              </Typography>
            }
            { onChangeTranspose &&
              <Tooltip title='transpose'>
                <IconButton onClick={onChangeTranspose}>
                  <TransposeIcon />
                </IconButton>
              </Tooltip>
            }
          </th>
          <th colSpan={colValues.length}>
            <Typography align='center' variant='headline'>
              {cols}
            </Typography>
          </th>
        </tr>
        <tr>
          { colValues.map(d =>
              <th key={d}>
                <Typography align='center'>
                  {autoFormat(d)}
                </Typography>
              </th>
            )
          }
        </tr>
      </thead>

      <tbody>
        { rowValues.map((r, i) =>
            <tr key={r}>
              {i === 0 &&
                <th rowSpan={rowValues.length}>
                  <Typography
                    variant='headline'
                    style={{
                      writingMode: 'vertical-rl',
                      textOrientation: 'sideways'
                    }}
                  >
                    {rows}
                  </Typography>
                </th>
              }
              <th>
                <Typography>
                  {autoFormat(r)}
                </Typography>
              </th>
              { colValues.map((c, j) =>
                  React.cloneElement(children,
                    { key: c,
                      row: r,
                      col: c,
                      left: j === colValues.length - 1,
                      bottom: i === rowValues.length - 1,
                      uniques, ...props}
                  )
                )
              }
            </tr>
          ) 
        }
      </tbody>

      <tfoot>
        <tr>
          <td colSpan={2}/>
          <td colSpan={colValues.length} align='center'>
          </td>
        </tr>
      </tfoot>
    </table>
  }
}

export const AggregationWrapper = ({grouped=[], index, rows, cols, values, transposed, bins=10, children, ...props}) => {
  if (transposed) {
    [rows, cols] = [cols, rows];
  }

  const filter = new Set(index || []);

  const by = [cols, rows, values];

  if (grouped.length === 0) {
    return <div>No data provided</div>
  }

  // error checking
  for (let k of by) {
    if (!(k in grouped[0])) {
      const err = `${k} is not a valid column name.`
      console.error(err);
      return <div>{err}</div>
    }
  }

  const uniques = {};
  by.forEach(k =>
    uniques[k] = Array.from(new Set(grouped.map(d => d[k])))
      .sort(compareRange)
  );

  const tree = asHierarchy(
    rollup(
      grouped,
      leaves => merge(leaves.map(d =>
        index ? d._index.filter(i => filter.has(i)) : d._index
      )),
      ...by.map(k => d => d[k])
    )
  );

  return React.cloneElement(
    children,
    {uniques, tree, rows, cols, values, ...props}
  );
}

const FacetedHeatmapInner = ({tree, uniques, rows, cols, values, component, ...props}) =>
  <Grid container spacing={32}>
    { uniques[values].map(k =>
        <Grid item key={k}>
          <InstanceDrawer
            key={k}
            anchor='right'
            data={{
              index: Object.keys(props.samples),
              data: [],
              columns: []
            }}
            samples={props.samples}
            component={component}
          >
            <Facet
              uniques={uniques}
              tree={tree}
              values={values}
              value={k}
              rows={rows}
              cols={cols}
              {...props}
            >
              <HeatmapCell />
            </Facet>
          </InstanceDrawer>
        </Grid>
      )
    }
  </Grid>


export const FacetedHeatmap = props =>
  <AggregationWrapper {...props}>
    <FacetedHeatmapInner />
  </AggregationWrapper>

export default FacetedHeatmap
