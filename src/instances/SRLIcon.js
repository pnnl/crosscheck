import React from 'react'

const SentenceSplitter = ({terms={}, text='', style={}}) => {
  terms = Object.entries(terms)
    .map(([key, value]) => {
      const start = text.indexOf(value);
      return {key, value, start, end: start + value.length};
    })
    .sort((a, b) => a.start - b.start);

  return <div>
    { terms.map(({key, value, start, end}, i) => [
        <span>{text.slice(i === 0 ? 0 : terms[i - 1].end, start)}</span>,
        <span style={style[key]}>{value}</span>
      ])
    }
    <span>{text.slice(terms[terms.length - 1].end)}</span>
  </div>
}

const ARG0 = {
  fontWeight: 'bold',
  textDecoration: 'underline'
}

export const SRLIcon = ({sent, ...props}) => {

  return <div style={{width: 350}}>
    <SentenceSplitter
      terms={props}
      text={sent}
      style={{
        ARG0, ARG1: ARG0,
        verb: {fontStyle: 'italic'}
      }}
    />
  </div>
}