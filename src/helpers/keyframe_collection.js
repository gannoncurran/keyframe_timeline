var floatify = require('./floatify.js');
var objectAssign = require('object-assign');
var tweenFunctions = require('tween-functions');

function KeyframeCollection(options) {

  this.id             = options.id            || null;
  this.DOMRef         = options.DOMRef        || null;
  this.tlStart        = options.tlStart       || 0;
  this.tlEnd          = options.tlEnd         || 100;
  this.totalDuration  = options.totalDuration || 1000;
  this.valueMappedTl  = false;
  this.keyframeKeys   = [];
  this.keyframes      = {};

  if ((options.tlStart && !options.tlEnd) || (!options.tlStart && options.tlEnd)) {
    throw "Error: Timeline position value mapping requires that both tlStart and tlEnd be set in options object."
  }

  if (options.tlStart && options.tlEnd) this.valueMappedTl = true;

};

KeyframeCollection.prototype.mapValueToPercent = function(value, zeroPoint, hundredPoint) {
  var zeroPoint     = zeroPoint     || this.tlStart;
  var hundredPoint  = hundredPoint  || this.tlEnd;
  return (100 * (value - zeroPoint)) / (hundredPoint - zeroPoint);
};

KeyframeCollection.prototype.trimToRange = function(value, min, max) {
  var min = min || 0;
  var max = max || 100;
  return value < min ? min :
         value > max ? max : 
         value;
};

KeyframeCollection.prototype.addKeyframe = function(keyframeObj) {

  var tlPos = floatify(keyframeObj.tlPos);

  switch (keyframeObj.posType) {
    case '#':
      if (!this.valueMappedTl) {
        throw "Error: Set tlStart and tlEnd explicity when keyframe collection is created to use non % values as timeline positions.";
      }
      tlPos = this.mapValueToPercent(tlPos);
      if (tlPos < 0 || tlPos > 100) {
        throw "Error: Timeline Position (tlPos) is out of bounds. Verify tlPos against tlStart & tlEnd."
      }
      break;

    default:
      if (this.valueMappedTl) {
        throw "Error: Expected a mapped value for timeline position (tlPos). Include posType: '#' in keyframe object.";
      } else if (tlPos < 0 || tlPos > 100) {
        throw "Error: Not using mapped values. Timeline Position (tlPos) should be between 0 and 100 to represent a percentage.";
      }
  }

  this.keyframeKeys.push(tlPos);
  this.keyframeKeys.sort(function(a, b){
    return a - b;
  });

  this.keyframes[tlPos] = keyframeObj;

  return true;

};

KeyframeCollection.prototype.removeKeyframe = function(tlPos) {

  // TODO?: could floating point uncertainty make it hard to reliably delete items?
  //        If this turns out to be the case, perhaps cross ref to closest entry in
  //        keyframeKeys, since these values match prop names exactly.

  return delete this.keyframes[floatify(tlPos)];

};

KeyframeCollection.prototype.getTween = function(tlPos) {

  var tlPos = floatify(tlPos);
  var keyKeys = this.keyframeKeys;

  tlPercent = this.mapValueToPercent(tlPos);
  tlPercent = this.trimToRange(tlPercent);

  var fromPercent;
  var toPercent;

  for (var i = 0; i < keyKeys.length - 1; i ++) {
    fromPercent = keyKeys[i];
    toPercent = keyKeys[i+1];

    if (tlPercent < toPercent) {
      break;
    }

    fromPercent = keyKeys[keyKeys.length - 2];
    toPercent = keyKeys[keyKeys.length - 1];
  }

  tlPercent = this.trimToRange(tlPercent, fromPercent, toPercent);

  var t = this.totalDuration * ((tlPercent - fromPercent) / 100);
  var b = this.keyframes[fromPercent].data.left;
  var c = this.keyframes[toPercent].data.left;
  var d = this.totalDuration * ((toPercent - fromPercent) / 100);

  return tweenFunctions.linear(t, b, c, d);

};

module.exports = KeyframeCollection;


