import React from 'react'

import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography'
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';

import ReactJson from 'react-json-view'

//

export function Statement ({background='lightgray', avatar, primary, secondary, text=[], json}) {

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  if (typeof(text) === 'string') {
    text = [text];
  }

  return [
    <ListItem component='div' button onClick={handleClick} key='main-list'>
      <ListItemAvatar>
        <Avatar style={{background}}>
          {avatar}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={primary} secondary={secondary} />
      {open ? <ExpandLess /> : <ExpandMore />}
    </ListItem>,

    <Collapse in={open} timeout="auto" unmountOnExit key='collapse'>
      <List>
        { text.map((d, i) =>
            <ListItem>
              <ListItemText key={i} primary={d} />
            </ListItem>
          )
        }
        <Divider />
        <ListItem>
          <ReactJson
            collapsed
            enableClipboard={({src}) =>
              navigator.clipboard.writeText(JSON.stringify(src, null, 2))
            }
            src={json}
          />    
        </ListItem>
      </List>
    </Collapse>

  ]
}
