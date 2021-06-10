import React from 'react'

import {Map, Set, fromJS} from 'immutable'

import {scaleLinear} from 'd3-scale'
import {max} from 'd3-array'

import Drawer from '@material-ui/core/Drawer'
import Typography from '@material-ui/core/Typography'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import Badge from '@material-ui/core/Badge';

//

import {takeIndex} from '../util/DataFrame'

import InstanceTable from './InstanceTable'
import InstanceDrawer from './InstanceDrawer'

import {compareRange} from '../util'
import {applyFilter} from '../util/filter'
import {autoFormat} from '../util/formatting'

export const innerColor = 'dodgerblue';
export const outerColor = 'darkgray';

const baseStyle = {
  display: 'inline-block',
  cursor: 'pointer',
  minHeight: '1em',
};

const outerBarStyle = {
  ...baseStyle,
  lineHeight: 0,
  backgroundColor: outerColor,
  marginTop: 1,
  marginLeft: 2
};

const innerBarStyle = {
  ...baseStyle,
  backgroundColor: innerColor,
};

const tooltipStyle = {
  ...baseStyle,
  marginLeft: 5,
};

const x = d => d.length;
const getHistogramSize = data => max(Object.values(data), x);

export const Histogram = ({
  data={},
  title,
  index,
  filter={},
  width=150,
  height,
  xmax,
  onClick,
  onFilter
}) =>{

  const emptyFilter = index === undefined;

  height = height || width*9/16;

  xmax = xmax || getHistogramSize(data)

  const xScale = scaleLinear()
    .domain([0, xmax])
    .range([0, width - 20*!emptyFilter]);

  index = new Set(index || []);

  const keys = Object.keys(data).sort(compareRange);

  return keys.map(key => {
    const values = data[key];
    const dx = xScale(x(values));

    const valuesFiltered = values.filter(d => index.has(d));
    const dxFiltered = xScale(x(valuesFiltered));

    return <tr key={key}>
      <td>
        <CheckCircleIcon
          onClick={() => onFilter && onFilter(title, key)}
          style={{
            fontSize: '.75em',
            opacity: filter[key] ? 1 : 0.1,
            cursor: 'pointer'
          }}
        />
      </td>

      <td>
        <div
          style={{textAlign: 'right', cursor: 'pointer'}}
          onClick={() => onFilter && onFilter(title, key)}
        >
          <Typography>
            {autoFormat(key)}
          </Typography>
        </div>
      </td>
      <td>
        <div>
          <div
            onClick={() => onClick && onClick(values)}
            style={{
              maxWidth: dx,
              minWidth: dx,
              ...outerBarStyle
            }}
          >
            <div
              onClick={e => {
                onClick && onClick(valuesFiltered);
                e.stopPropagation();
              }}
              style={{
                minWidth: dxFiltered,
                // minHeight: height,
                ...innerBarStyle
              }}
            />
          </div>
          <Typography style={tooltipStyle}>
            <span
              style={{color: innerColor}}
              onClick={() => onClick && onClick(valuesFiltered)}
            >
              { !emptyFilter && `${autoFormat(valuesFiltered.length)} / `}
            </span>
            <span
              style={{color: outerColor}}
              onClick={() => onClick && onClick(values)}
            >
              {autoFormat(values.length)}
            </span>
          </Typography>
        </div>
      </td>
    </tr>
  })
}

export const HistogramGroup = props => {

  if (props.data === undefined) {
    return <table />
  }

  const xmax = max(
    Object.values(props.data)
      .map(getHistogramSize)
  );

  const {index, filter={}} = props;

  return <table>
    <tbody
      style={{userSelect: 'none'}}
    >
      { Object.entries(props.data).map(([key, value]) => [
          <tr key={`${key}-title`} style={{marginTop: 10}}>
            <td colSpan={3}>
              <Typography variant='headline'>
                {key}
              </Typography>
            </td>
          </tr>,
          <Histogram
            {...props}
            key={`${key}-data`}
            title={key}
            data={value}
            index={index}
            filter={filter[key]}
            xmax={xmax}
          />
        ])
      }
    </tbody>
  </table>
}

const ShowNotesButton = ({notes, onClick}) =>

  <IconButton
    color='primary'
    disabled={notes.size === 0}
    onClick={() => onClick(Array.from(notes.keys()))}
  >
    <Badge badgeContent={notes.size} color='secondary'>
      <CommentIcon style={{height: '1em'}}/>
    </Badge>
  </IconButton>

export default class HistogramGroupWrapper extends React.Component {
  state = {
    filter: Map(),
    notes: Map(),
    filterNotes: false
  }

  handleToggleFilter = (key, value) => {
    const path = [key, value];
    const filter = (
      this.state.filter.hasIn(path)
        ? this.state.filter.deleteIn(path)
        : this.state.filter.setIn(path, true)
    ).filter(d => d.size);

    return this.setState({filter});

  }

  handleClick = selection =>
    this.setState({selection})

  handleClose = () => 
    this.setState({selection: undefined})

  handleChangeNote = (key, value) =>
    this.setState({notes: this.state.notes.set(key, value)})

  handleChangeFilterNotes = () =>
    this.setState({filterNotes: !this.state.filterNotes})

  render() {
    const {selection, notes, filterNotes} = this.state;
    const {children, data, binned, model} = this.props;
    const filter = this.state.filter.toJS();

    let index = undefined;

    if (Object.keys(filter).length > 0) {
      index = applyFilter({data: binned, filter})
        .filter(d => !filterNotes || notes.has(d));
    } else if (filterNotes) {
      index = Array.from(notes.keys());
    }

    const showColumns = Object.keys(binned);

    // if a backbone.js model is passed, update the filter
    if (model) {
      model.set({
        filter,
        index: index || [],
        notes: notes.toJS()
      });
      model.save_changes();
    }

    return <table><tbody><tr valign='top'>
      <td style={{minWidth: 200}}>
        <FormGroup row>
          <InstanceDrawer
            anchor='right'
            data={{
              index: Array.from(notes.keys()),
              data: [],
              columns: []
            }}
            samples={this.props.samples}
            component={this.props.component}
            notes={notes}
            onChangeNote={this.handleChangeNote}
          >
            <ShowNotesButton notes={notes}/>
          </InstanceDrawer>
        
          <FormControlLabel
            control={
              <Switch
                checked={filterNotes}
                onChange={this.handleChangeFilterNotes}
              />
            }
            label="Notes Only"
          />
        </FormGroup>

        <HistogramGroup
          {...this.props}
          width={100}
          data={binned}
          index={index}
          filter={filter}
          onFilter={this.handleToggleFilter}
          onClick={this.handleClick}
        />
      </td>

      <td>
        { React.cloneElement(children, {
          ...this.props,
          index, 
          showColumns,
          notes,
          onChangeNote: this.handleChangeNote
        })}
      </td>
    </tr></tbody></table>
  }
}
