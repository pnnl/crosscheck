import React from 'react'

import ReactJson from 'react-json-view'

import FetchURL from './FetchURL'

import * as ner from './NERIcon'
import * as mc from './MachineComprehensionIcon'
import * as nerCombined from './NERCombinedIcon'
import * as trivia from './TriviaIcon'
import * as srl from './SRLIcon'
import * as image from './Image'
import * as statement from './Statement'
import * as email from './NewsgroupsComponent'
import * as highlight from './Highlight'

const Components = {
  ...ner,
  ...mc,
  ...nerCombined,
  ...trivia,
  ...srl,
  ...image,
  ...statement,
  ...email,
  ...highlight
};

const JsonInstance = props =>
  <ReactJson
    collapsed
    enableClipboard={({src}) =>
      navigator.clipboard.writeText(JSON.stringify(src, null, 2))
    }
    src={props}
  />

const Instance = ({component, id, ids, showJsonProps, prefix='', suffix='.json', instanceProps}) => {
  const InstanceComponent = Components[component];
  const url = `${prefix}/${ids[id]}${suffix}`;

  if (component === 'img') {
    return <img src={url} style={{width: '100%'}} />
  }

  return <FetchURL url={url}>
    { InstanceComponent !== undefined
        ? <InstanceComponent {...instanceProps}/>
        : <JsonInstance />
    }
  </FetchURL>
}

export default Instance
