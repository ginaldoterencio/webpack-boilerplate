const nunjucks = require('nunjucks');
const event = 'html-webpack-plugin-before-html-processing';

function NunjucksPlugin(options) {
  this.options = options;
}

NunjucksPlugin.prototype.apply = function(compiler) {
  var _self = this;

  compiler.plugin('compilation', function(compilation) {
    compilation.plugin(event, function(data, cb) {
      var context = require(_self.options.context);
      var loader = new nunjucks.FileSystemLoader(_self.options.searchPaths);
      var nunjEnv = new nunjucks.Environment(loader);
      var template = nunjucks.compile(data.html, nunjEnv);

      data.html = template.render(context);

      cb(null, data);
    })
  })
}

module.exports = NunjucksPlugin;
