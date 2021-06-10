import React from 'react'

import {Map} from 'immutable'

import TablePagination from '@material-ui/core/TablePagination'
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';

import {range} from 'd3-array'
import {format} from'd3-format'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

// 

import InstanceNoteDialog from './InstanceNoteDialog'

import {sort, takeIndex} from '../util/DataFrame'

import Instance from '../instances'

import {autoFormat} from '../util/formatting'

export const InstanceTable = ({
  data,
  showColumns=[],
  sortBy,
  direction=1,
  page=0,
  rowsPerPage=5,
  children,
  onChangePage,
  onChangeRowsPerPage,
  onChangeSortBy,
  onChangeNote,
  notes=Map(),
  ...props
}) => {
  // filter out rows that don't have corresponding sample data
  if (data === undefined) {
    return <div />
  }

  if (props.index !== undefined) {
    data = takeIndex(data, props.index);
  }

  if (sortBy !== undefined) {
    data = sort(data, sortBy, direction);
  }

  const {index=[], columns=[]} = data;

  // filter out 
  const row_indices = range(rowsPerPage*page, Math.min(index.length, rowsPerPage*(page + 1)))
  const column_indices = showColumns.map(d => columns.indexOf(d));

  return <table rules="rows">
    <thead>
      <tr>
        <td/>

        <TablePagination
          component='td'
          rowsPerPageOptions={[5, 10, 25]}
          colSpan={1}
          count={index.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
        />

        { column_indices.map(c =>
            <td key={c}>
              <Tooltip
                title={`Sort by: ${columns[c]}`}
                enterDelay={300}
              >
                <TableSortLabel
                  active={sortBy === columns[c]}
                  direction={direction === 1 ? 'asc' : 'desc'}
                  onClick={() => onChangeSortBy && onChangeSortBy(columns[c])}
                >
                  <div
                    style={{
                      maxWidth: 75,
                      overflow:'hidden',
                      textOverflow: 'ellipsis',
                    }}                  
                  >
                    {columns[c]}
                  </div>
                </TableSortLabel>
              </Tooltip>
            </td>
          )
        }
      </tr>
    </thead>

    <tbody>
      { row_indices.map(i => {
          const id = index[i]
          return <tr key={i} style={{border: 'solid 1px lightgray'}}>
            <td>
              <InstanceNoteDialog
                component={
                  <Instance id={id} showJsonProps {...props}/>
                }
                value={notes.get(index[i])}
                onSubmit={value => onChangeNote && onChangeNote(index[i], value)}
              />
            </td>

            <td>
              <Instance id={id} {...props} />
            </td>

            { column_indices.map(j =>
                <td key={j} style={{textAlign: 'center'}}>
                  { autoFormat(data.data[i][j]) }
                </td>
              )
            }
          </tr>
        })
    }
    </tbody>
  </table>
}

export default class InstanceTableStateful extends React.Component {
  state = {
    direction: 1
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  }

  handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: event.target.value });
  }

  handleChangeSortBy = sortBy => {
    if (this.state.sortBy === sortBy) {
      this.setState({direction: -1*this.state.direction})
    } else {
      this.setState({sortBy});
    }
  }

  render() {
    return <InstanceTable
      {...this.state}
      {...this.props}

      onChangePage={this.handleChangePage}
      onChangeRowsPerPage={this.handleChangeRowsPerPage}
      onChangeSortBy={this.handleChangeSortBy}
    />

  }
}