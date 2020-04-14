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
  // use Regexp, no format the code
  return styles.replace(/(([0-9]+)\.?([0-9]*))\s*(rem|r?px)/g, function(all) {
    return fn(all, options.size || 16, unit);
  })
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