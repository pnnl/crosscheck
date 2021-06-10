crosscheck-widget
===============================

Model comparison and debugging

Installation
------------

To install use pip:

    $ pip install crosscheck
    $ jupyter nbextension enable --py --sys-prefix crosscheck

To install for jupyterlab

    $ jupyter labextension install crosscheck

For a development installation (requires npm),

    $ git clone https://github.com/PNNL/crosscheck-widget.git
    $ cd crosscheck-widget
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --sys-prefix crosscheck
    $ jupyter nbextension enable --py --sys-prefix crosscheck
