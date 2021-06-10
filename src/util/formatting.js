import {format} from 'd3-format'

export const humanFormat = format('.3~s');
export const smallNumberFormat = format('.2');

export const autoFormat = d => {
  if (d === undefined) {
    return 'null';
  }
  else if (typeof(d) === 'number') {
    if (d < 1) {
      return smallNumberFormat(d);
    } else {
      return humanFormat(d);
    }
  } else if (d.indexOf('-') !== -1) {
    return d.split('-')
      .map(d => Number(d) || d)
      .map(autoFormat)
      .join(' - ');
  } else {
    return d;
  }
}
