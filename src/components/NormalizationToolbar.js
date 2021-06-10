import React from 'react'

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel'

import ViewColumnIcon from '@material-ui/icons/ViewColumn'
import ViewModuleIcon from '@material-ui/icons/ViewModule'
import AppsIcon from '@material-ui/icons/Apps'

const SimpleIconButtonToolbar = ({options, selection, onClick, ...props}) =>
  <FormControl
    style={{marginTop: 25}}
  >
    <InputLabel>
      Normalization
    </InputLabel>
    <Select
      style={{padding: 0}}
      value={selection || options[0].value}
      onChange={event => onClick && onClick(event.target.value)}
      {...props}
    >
      { options.map(({value, icon, title, ...props}) =>
          <MenuItem 
            key={value}
            value={value}
          >
            {title || value}
          </MenuItem>
        )
      }
    </Select>
  </FormControl>

const NormalizationToolbar = props =>
  <SimpleIconButtonToolbar
    autoWidth
    options={[
      {value: 0, title: 'table'},
      {value: 1, title: 'columns'},
      {value: 2, title: 'cells'}
    ]}
    {...props}
  />

export default NormalizationToolbar
