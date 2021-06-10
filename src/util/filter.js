import {merge} from 'd3-array'

export const union = sets => Array.from(new Set(merge(sets)));

export const pairwise_intersection = (s, t) => {
  t = new Set(t);
  return s.filter(d => t.has(d));
}

export const intersection = sets => sets.reduce(pairwise_intersection);

export const applyFilter = ({data, filter={}, must=true}) => {
  const sets = Object.entries(filter)
    .map(([k1, value]) =>
      union(Object.keys(value).map(k2 => data[k1][k2]))
    );

  if (sets.length) {
    return must
      ? intersection(sets)
      : union(sets);
  }

  return [];
}
