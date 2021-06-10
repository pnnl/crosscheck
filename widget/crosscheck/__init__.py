from ._version import version_info, __version__

from .crosscheck_plugin import *

def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'static',
        'dest': 'crosscheck-widget',
        'require': 'crosscheck-widget/extension'
    }]
