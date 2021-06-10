import {range} from 'd3-array'

const take_ary = (ary, iis) => iis.map(i => ary[i])

export const takeBoolean = ({data, index, columns}, boolean_mask) => {
    const iis = range(boolean_mask.length)
      .filter(i => boolean_mask[i]);

    return {
      data: take_ary(data, iis),
      index: take_ary(index, iis),
      columns
    };
}

export const takeInteger = ({data, index, columns}, integer_mask) => {
  return {
    data: take_ary(data, integer_mask),
    index: take_ary(index, integer_mask),
    columns
  }
}

export const takeIndex = (data, index_mask) => {
  const index_set = new Set(index_mask);

  return takeBoolean(
    data,
    data.index.map(i => index_set.has(i))
  )
}

export const sort = (df, by, direction) => {
  const j = df.columns.indexOf(by);

  if (j >= 0) {
    const iis = range(df.index.length)
      .sort((a, b) => {
        a = df.data[a][j];
        b = df.data[b][j];

        if (a < b) {
          return -1*direction;
        } else if (a > b) {
          return 1*direction;
        }
        return 0;
      });

    return takeInteger(df, iis);
  }

  return df
}
