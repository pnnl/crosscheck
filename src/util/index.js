import {hierarchy} from 'd3-hierarchy'
import {min, max, group, extent, sum} from 'd3-array'

export const lookup = ary => {
  const result = {};
  ary.forEach((k, i) => result[k] = i);
  return result;
}

export const groupby = (df, by) => {
  const {data=[], index=[], columns=[]} = df;
  const inv = {
    columns: lookup(columns),
    index: lookup(index)
  };

  const identity = v => v;

  const args = Object.entries(by).map(([key, func=identity]) =>
    i => func(data[inv.index[i]][inv.columns[key]])
  )

  return group(index, ...args);
}

export const uniques = df =>
  new Map(
    df.columns.map(k =>
      [k, groupby(df, {[k]: undefined})]
    )
  )

export const description = df => {
  const hasAnyStrings = values =>
    sum(values, v => typeof v === 'string') > 0
  
  const isWholeNumbers = values =>
    sum(values, v => v === Math.round(v)) === 0

  return new Map(
    Array.from(uniques(df).entries()).map(([key, values]) => {
      console.log('values in descr', values);

      values = Array.from(values.keys());
      const cardinality = values.length;

      if (hasAnyStrings(values)) {
        return [key, {
          type: 'categorial',
          domain: values,
          cardinality
        }];
      } else if (isWholeNumbers(values)) {
        return [key, {
          type: 'ordinal',
          domain: extent(values),
          cardinality
        }];
      }

      return [key, {
        type: 'continuous',
        domain: extent(values),
        cardinality
      }];
    })
  );
}

export const getIn = (grouped, ...args) => {
  for (let k of args) {
    if (grouped !== undefined) {
      grouped = grouped.get(k);
    }
  }

  return grouped;
}

export const getInHierarchy = (node, ...args) => {
  for (let k of args) {
    if (node !== undefined) {
      node = node.childrenMap.get(k);
    }
  }

  return node;
}

const treeCmp = (cmp, key, name) =>
  d => d[name] = d.children
    ? cmp(d.children, d => d[name])
    : d[key]


export const asHierarchy = values =>
  hierarchy({values}, ({values}) =>
    values instanceof Map
      ? Array.from(values.entries())
          .map(([key, values]) => ({key, values}))
      : null
  )
    .each(d =>
      d.childrenMap = d.children
        ? new Map(d.children.map(d => [d.data.key, d]))
        : undefined
    )
    .sum(({values}) =>
      values instanceof Map
        ? 0
        : values.length
    )
    .each(d =>
      d.pct = d.parent
        ? d.value / d.parent.value
        : 1
    )
    .eachAfter(treeCmp(max, 'value', 'value_max'))
    .eachAfter(treeCmp(max, 'pct', 'pct_max'))
    .eachAfter(treeCmp(min, 'value', 'value_min'))
    .eachAfter(treeCmp(min, 'pct', 'pct_min'));

export const compareRange = (a, b) => {
  if (typeof(a) === 'string' && typeof(b) === 'string') {
    const [aMin] = a.split('-').map(Number);
    const [bMin] = b.split('-').map(Number);

    if (!isNaN(aMin) && !isNaN(bMin)) {
      return aMin - bMin;
    } else {
      return a.localeCompare(b);
    }
  } else {
    return a - b;
  }
}