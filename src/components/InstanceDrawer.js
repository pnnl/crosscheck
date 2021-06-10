import React from 'react'

import {range} from 'd3-array'

import Drawer from '@material-ui/core/Drawer'

//

import InstanceTable from './InstanceTable'
import {takeBoolean} from '../util/DataFrame'

class InstanceDrawer extends React.Component {
  state = {}

  handleOpenDrawer = selection =>
    this.setState({selection})

  handleCloseDrawer = () =>
    this.setState({selection: undefined})

  render() {
    const {data, children, notes, onChangeNote, ...props} = this.props;
    const index = this.state.selection || [];

    return <div>
      { React.cloneElement(children, {onClick: this.handleOpenDrawer}) }

      <Drawer
        anchor='right'
        open={index.length > 0}
        onClose={this.handleCloseDrawer}
      >
        <div style={{margin: 5, maxWidth: 500}}>
          <InstanceTable
            {...props}
            data={{index}} showColumns={[]}
            onChangeNote={onChangeNote}
            notes={notes}
          />
        </div>
      </Drawer>
    </div>
  }
}

export default InstanceDrawer