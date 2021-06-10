import React from 'react'

import Typography from '@material-ui/core/Typography'

import {NERBadge} from './NERCombinedIcon'

const NERSentenceComponent = ({sentence, word, start_idx, bio, role}) =>
  <Typography>
    <span>
      {sentence.slice(0, start_idx)}
    </span>

    <NERBadge badgeContent={role}>
      { word }
    </NERBadge>

    <span>
      {sentence.slice(start_idx + word.length, sentence.length)}
    </span>
  </Typography>

class NERIcon extends React.Component {
  state = {}

  handleExpandClick = () => {
    this.setState({expanded: !this.state.expanded})
  }

  render() {
    const {width=350, train, test, predicted_BIO, predicted_role, actual_BIO, actual_role, ...props} = this.props;
    const {expanded} = this.state;

    return <div style={{width, margin: 5}}>
      <NERSentenceComponent
        role={predicted_role}
        bio={predicted_BIO}
        {...props}
      />
    </div>
  }
}

export {NERIcon}