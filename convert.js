var css = require("css");
var walk = require("rework-walk");

function remto(value, size, unit = 'px') {
  // From https://github.com/nfroidure/rework-rem2px/blob/master/src/index.js
  if (/([0-9]+)\.?([0-9]*)\s*rem/.test(value)) {
    return parseFloat(value, 10) * size + unit;
  }
  return value;
}

function torem(value, size) {
  if (/([0-9]+)\.?([0-9]*)\s*(r)?px/.test(value)) {
    return (parseFloat(value, 10) / size ) + 'rem';
  }
  return value;
}

var totarget = function(styles, options, fn, unit) {
  options = options || {};
  var ast = css.parse(styles);
  walk(ast.stylesheet, function(rule) {
    if (rule.declarations) {
      rule.declarations.forEach(function(decl) {
        decl.value = fn(decl.value, options.size || 16, unit);
      });
    }
  });
  return css.stringify(ast, { compress: options.compress });
}

module.exports = {
  remtopx: function(styles, options) {
    return totarget(styles, options, remto, 'px')
  },
  remtorpx: function(styles, options) {
    return totarget(styles, options, remto, 'rpx')
  },
  pxtorem: function(styles, options) {
    return totarget(styles, options, torem);
  },
  rpxtorem: function(styles, options) {
    return totarget(styles, options, torem);
  }
}