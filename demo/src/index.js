import React, {Component} from 'react'
import {render} from 'react-dom'

import {Paper, Typography} from '@material-ui/core'

import mc from '../public/mc/props.json'
import ner from '../public/ner/props.json'

import {HistogramHeatmap} from '../../src'

const CreativeCommonsSA = () =>
  <a href='https://creativecommons.org/licenses/by-sa/4.0/legalcode'>
    CC BY-SA 4.0
  </a>

const demos = [
  { title: 'Named Entity Recognition',
    props: ner,
  },
  { title: 'Reading Comprehension',
    props: {...mc, prefix: 'mc/json'},
    dataset: <a href='https://rajpurkar.github.io/SQuAD-explorer/'>SQuAD</a>,
    license: <CreativeCommonsSA/>
  }
]

const style = {
  style: { margin: 10, padding: 5 }
}

const Demo = ({title, props, dataset, license}) =>
  <Paper {...style}>
    <Typography variant='h4'>
      {title}
    </Typography>
  
    <HistogramHeatmap {...props}/>
  
    { dataset && license &&
      <Typography variant='caption'>
        The demonstration of CrossCheck for "{title}" uses the {dataset} dataset licensed under {license}.
      </Typography>
    }
  </Paper>

render(
  <div>
    <Paper {...style}>
      <Typography variant='h1'>CrossCheck:</Typography>

      <Typography variant='h4'>
        Rapid, Reproducible, and Interpretable Model Evaluation
      </Typography>

      <Typography>
        Evaluation beyond aggregate performance metrics, e.g. F1-score, is crucial to both establish an appropriate level of trust in machine learning models and identify future model improvements. In this paper we demonstrate CrossCheck, an interactive visualization tool for rapid crossmodel comparison and reproducible error analysis. We describe the tool and discuss design and implementation details. We then present three use cases (named entity recognition, reading comprehension, and clickbait detection) that show the benefits of using the tool for model evaluation. CrossCheck allows data scientists to make informed decisions to choose between multiple models, identify when the models are correct and for which examples, investigate whether the models are making the same mistakes as humans, evaluate models’ generalizability and highlight models’ limitations, strengths and weaknesses. Furthermore, CrossCheck is implemented as a Jupyter widget, which allows rapid and convenient integration into data scientists’ model development workflows.
      </Typography>
    </Paper>

    { demos.map((d, i) => <Demo key={i} {...d}/> ) }

  </div>,
  document.querySelector('#demo')
)
