import React from 'react'

import ButtonBase from '@material-ui/core/ButtonBase';
import Popover from '@material-ui/core/Popover';

class SimplePopover extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  render() {
    const { children, content='Popover content', ...props} = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div>
        <div
          aria-owns={open ? 'simple-popper' : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          {children}
        </div>

        <Popover
          id="simple-popper"
          open={open}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          {...props}
        >
          {content}
        </Popover>
      </div>
    );
  }
}


export default SimplePopover