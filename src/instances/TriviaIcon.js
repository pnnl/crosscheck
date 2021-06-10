import React from 'react'

import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Toolbar from '@material-ui/core/Toolbar';

import FaceIcon from '@material-ui/icons/Face';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';

import {
  Answer,
  machineColor,
  humanColor,
  highlightStyle,
} from './MachineComprehensionIcon'

class TriviaIcon extends React.Component {
  state = {
    expanded: false
  }

  handleHighlight = highlight => () =>
    this.setState({highlight})

  handleExpandClick = () => {
    this.setState({expanded: !this.state.expanded})
  }

  render() {
    const {
      width=400,
      question,
      context,
      answer_start,
      answer_text,
      answer_variants,
      predicted_answer_start,
      predicted_answer_text,
      expanded,
      highlight = 'machine'
    } = {...this.state, ...this.props};

    let start = predicted_answer_start;
    let text = predicted_answer_text;

    const currentHighlightStyle = {
      ...highlightStyle,
      backgroundColor: machineColor
    }

    if (highlight === 'human') {
      start = answer_start;
      text = answer_text;
      currentHighlightStyle.backgroundColor = humanColor;
    }

    const end = start + text.length;

    return <div
      style={{minWidth: width, maxWidth: width, cursor: 'pointer'}}
      onClick={this.handleExpandClick}
    >
      <Typography style={{fontWeight: 'bold'}}>
        {question}
      </Typography>

      <Toolbar disableGutters variant='dense'>
        <Answer
          avatar={
            <DesktopWindowsIcon style={{fontSize: '1em', color: machineColor}}/>
          }
          onMouseOver={this.handleHighlight('machine')}
        >
          {predicted_answer_text}
        </Answer>

        <div style={{flex: 1}}/>

        <Answer
          onMouseOver={this.handleHighlight('human')}
          avatar={
            <FaceIcon style={{fontSize: '1em', color: humanColor}}/>
          }
        >
          {answer_text}
        </Answer>

      </Toolbar>      

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Typography component='div' gutterBottom>
          { context.slice(0, start) }
          <span style={currentHighlightStyle}>
            { context.slice(start, end) }
          </span>
          { context.slice(end) }
        </Typography>
        <hr/>
        <Typography component='div' gutterBottom>
          Variants: { answer_variants.join(', ') }
        </Typography>
      </Collapse>
    </div>
  }
}

export {TriviaIcon}
