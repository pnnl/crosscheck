import React, {Component} from 'react'

import InstanceTableBase from './components/InstanceTable'
import HistogramGroupWrapper from './components/Histogram'
import {FacetedHeatmap as FacetedHeatmapBase} from './components/Heatmap'
import {HistogramHeatmap as HistogramHeatmapBase} from './components/HistogramHeatmap'

export const Table = props =>
  <HistogramGroupWrapper {...props}>
    <InstanceTableBase />
  </HistogramGroupWrapper>

export const Heatmap = props =>
  <HistogramGroupWrapper {...props}>
    <FacetedHeatmapBase />
  </HistogramGroupWrapper>

export const HistogramHeatmap = props =>
  <HistogramGroupWrapper {...props}>
    <HistogramHeatmapBase />
  </HistogramGroupWrapper>

export default class extends Component {
  render() {
    return <div>
      <h2>Welcome to React components</h2>
    </div>
  }
}
