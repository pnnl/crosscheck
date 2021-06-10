import React, {Component} from 'react';

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import CardHeader from '@material-ui/core/CardHeader'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Toolbar from '@material-ui/core/Toolbar';

import deepPurple from '@material-ui/core/colors/deepPurple';
import deepOrange from '@material-ui/core/colors/deepOrange';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import FaceIcon from '@material-ui/icons/Face';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';

export const humanColor = deepPurple[200];
export const machineColor = deepOrange[200];

export const highlightStyle = {
  textDecoration: 'underline'
};

export const chipStyle = {
  margin: 2,
}

export const Answer = ({children, maxWidth=100, avatar, ...props}) =>
  <div {...props}>
    <div style={{display: 'inline-block', marginRight: 1, marginLeft: 5}}>
      {avatar}
    </div>
    <Typography
      style={{
        maxWidth: maxWidth - 25,
        overflow:'hidden',
        textOverflow: 'ellipsis',
        display: 'inline-block',
        whiteSpace: 'nowrap'
      }}
    >
      {children}
    </Typography>
  </div>

class MachineComprehensionIcon extends React.Component {
  state = {expanded: false}

  handleHighlight = (highlight) => () => {
    this.setState({highlight})
  }

  handleExpandClick = () => {
    this.setState({expanded: !this.state.expanded})
  }

  render() {
    const {_id, title, answers, context, question, machine_answer={}, answer_variants, width=400} = this.props;
    const {expanded, highlight} = this.state;

    const {answer_start, text=''} = highlight === undefined
      ? machine_answer
      : answers[highlight];

    const parts = [
      context.slice(0, answer_start),
      context.slice(answer_start, answer_start + text.length),
      context.slice(answer_start + text.length)
    ];

    const currentHighlightStyle = {
      ...highlightStyle,
      backgroundColor: highlight === undefined ? machineColor : humanColor
    }

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
          onMouseOver={this.handleHighlight()}
        >
          {machine_answer.text}
        </Answer>

        <div style={{flex: 1}}/>

        { answers.map(({text}, i) =>
            <Answer
              key={i}
              onMouseOver={this.handleHighlight(i)}
              avatar={
                <FaceIcon style={{fontSize: '1em', color: humanColor}}/>
              }
            >
              {text}
            </Answer>

          )
        }
      </Toolbar>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Typography component='div' gutterBottom>
          { parts.map((d, i) =>
              <span key={i} style={i == 1 ? currentHighlightStyle : null}>
                {d}
              </span>
            )
          }
        </Typography>

        <hr />

        <Typography gutterBottom variant='subtitle1'>
          {title}
        </Typography>

        { answer_variants && answer_variants !== '' &&
          <Typography gutterBottom variant='subtitle1'>
            Variants: { answer_variants.join(', ') }
          </Typography>
        }

        <Typography variant='subtitle1'>
          {_id}
        </Typography>

      </Collapse>

    </div>
  }
}

export {MachineComprehensionIcon}
