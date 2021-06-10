import json, os
import matplotlib
from matplotlib.ticker import AutoLocator

import ipywidgets as widgets
from traitlets import Unicode, Dict, List

import numpy as np

from notebook import notebookapp

def get_jupyter_url_from_local_path(path):
    # Caveat: this will only work if exactly one jupyter notebook is running
    # Todo: How do we match the appropriate session? can possibly look in
    #   s = notebookapp.Session()
    #   vars(s)
    # also, obj contains a PID of the notebook server and other useful things, how do we use that


    for obj in notebookapp.list_running_servers():
        return os.path.abspath(path).replace(obj['notebook_dir'], '/files')
    


def copy_dataframe_to_json_folder(df, output_path):
    for k, obj in df.to_dict(orient='index').items():
        path = os.path.join(output_path, f'{k}.json')
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w') as fp:
            json.dump(obj, fp)

def nice_bin_edges(x):
    l = AutoLocator()
    l.create_dummy_axis()
    return l.tick_values(x.min(), x.max())

def discretize(df, by=None, bins='nice', other_cutoff=20):
    if by is None:
        by = df.columns.tolist()

    df = df.copy()

    for c in by:
        max_bins = (10 if type(bins) == str else bins)
        if df.dtypes[c] != 'O' and len(df[c].unique()) > max_bins:
            x = df[c]

            if bins == 'nice':
                bin_edges = nice_bin_edges(x)
            else:
                bin_edges = np.histogram_bin_edges(x, bins)

            values = np.digitize(x, bin_edges[1:-1])
            df[c] = [f'{l:.2f} - {r:.2f}'
                     for l, r in zip(bin_edges[values], bin_edges[values + 1])]
        elif df.dtypes[c] == 'O':
            counts = df[c].value_counts().cumsum()
            if len(counts) > other_cutoff:
                keep = counts.index[2*counts.iloc[0] < (counts.iloc[-1] - counts)]
                
                if len(keep) < other_cutoff:
                    df.loc[~df[c].apply(set(keep).__contains__), c] = ' Other'
                else:
                    df.drop(columns=c, inplace=True)

    return df

def get_binned_data(df, by=None, **kwargs):
    df = discretize(df, by=by, **kwargs)
    return {
        col: df.groupby(col).apply(lambda x: x.index.tolist()).to_dict()
        for col in by or df.columns
        if col in df
    }

def get_grouped_data(df, by, bins):
    df = discretize(df, by=by, bins=bins)

    grouped = df.groupby(by).apply(lambda x: x.index.tolist())
    grouped.name='_index'
    return grouped.reset_index().to_dict(orient='records')

def get_valid_df(df, max_unique, ids):
    # valid = (df.dtypes != object) | (df.nunique() < max_unique)
    # df = df[valid.index[valid]]

    if ids is None:
        ids = df.index
    elif type(ids) == str:
        ids = df[ids]
        df = df.drop(columns=[ids])

    return df.reset_index(drop=True), list(ids)

@widgets.register
class ReactPlugin(widgets.DOMWidget):
    """An example widget."""
    _view_name = Unicode('ReactView').tag(sync=True)
    _model_name = Unicode('ReactModel').tag(sync=True)
    _view_module = Unicode('crosscheck-widget').tag(sync=True)
    _model_module = Unicode('crosscheck-widget').tag(sync=True)
    _view_module_version = Unicode('^0.1.0').tag(sync=True)
    _model_module_version = Unicode('^0.1.0').tag(sync=True)
    
    component = Unicode().tag(sync=True)
    props = Dict().tag(sync=True)

    def __init__(self):
        super().__init__()

        self.component = self.__class__.__name__

class Heatmap(ReactPlugin):
    filter = Dict().tag(sync=True)
    index = List().tag(sync=True)
    notes = Dict().tag(sync=True)

    def __init__(self, df, by=None, bins='nice', max_unique=20, ids=None, **kwargs):
        super().__init__()

        df, ids = get_valid_df(df, max_unique, ids)

        if by is None:
            by = df.columns[:3].tolist()

        if len(by) == 2:
            by.append('')
            df[''] = ''

        grouped = get_grouped_data(df, by, bins)

        columns = [c for c in df.columns if c not in by]
        binned = get_binned_data(df, columns, bins=bins)

        props = {
            'rows': by[0],
            'cols': by[1],
            'values': by[2],
            'grouped': grouped,
            'binned': binned,
            'ids': ids
        }

        props.update(kwargs)

        self.props = props

class HistogramHeatmap(Heatmap):
    def __init__(self, df, max_unique=20, by=None, ids=None, **kwargs):

        df, ids = get_valid_df(df, max_unique, ids)

        if by is None:
            by = df.columns[:3].tolist()

        scheme = kwargs.get('scheme')

        if by and len(by) == 3:
            values = by[-1]

            if not scheme:
                if df.dtypes[values] == 'O':
                    scheme = 'schemeCategory10'
                else:
                    scheme = 'schemeGreens'

                kwargs['scheme'] = scheme
                
        super().__init__(df, by=by, ids=ids, **kwargs)

class Table(ReactPlugin):
    filter = Dict().tag(sync=True)
    index = List().tag(sync=True)
    notes = Dict().tag(sync=True)

    def __init__(self, df, by=None, bins='nice', limit_examples=3, max_unique=20, ids=None, **kwargs):
        super().__init__()

        df, ids = get_valid_df(df, max_unique, ids=ids)
        
        data = df.to_dict(orient='split')

        binned = get_binned_data(df, by=df.columns.tolist(), bins=bins)

        self.props = {
            'binned': binned,
            'data': data,
            'ids': ids,
            **kwargs
        }
