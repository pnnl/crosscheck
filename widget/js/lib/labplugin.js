var plugin = require('./index');
var base = require('@jupyter-widgets/base');

module.exports = {
  id: 'crosscheck-widget',
  requires: [base.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'crosscheck-widget',
          version: plugin.version,
          exports: plugin
      });
  },
  autoStart: true
};

