import React from 'react'

import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Tooltip from '@material-ui/core/Tooltip'

//

class InstanceNoteDialog extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleCancel = () => {
    this.setState({ open: false, value: undefined });
  };

  handleSubmit = () => {
    const {onSubmit} = this.props;
    const {value} = this.state;
    this.handleCancel();
    if (onSubmit) {
      onSubmit(value);
    }
  }

  handleChange = event => {
    this.setState({value: event.target.value});
  }

  render() {
    const {component, open} = {...this.props, ...this.state};

    const value = this.state.value || this.props.value;

    return (
      <div>
        <Tooltip
          title={value || 'Click to write a note.'}
          placement='right'
        >
          <IconButton
            aria-label="Comments"
            variant="outlined"
            color={value ? 'primary' : 'default'}
            onClick={this.handleClickOpen}
          >
            <CommentIcon />
          </IconButton>
        </Tooltip>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            { component }

            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Notes"
              fullWidth
              onChange={this.handleChange}
              onFocus={() =>
                typeof Jupyter !== 'undefined' &&
                  Jupyter.keyboard_manager.disable()
              }
              onBlur={() => 
                typeof Jupyter !== 'undefined' &&
                  Jupyter.keyboard_manager.enable()
              }
              value={value}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default InstanceNoteDialog
