'use strict';

var React = require('react');
var tweenState = require('react-tween-state');
var Timeline = require('../helpers/timeline.js');
var KeyframeCollection = require('../helpers/keyframe_collection.js');

var lrTitleKeyframes = new KeyframeCollection({
  // tlStart: 15,
  // tlEnd: 60,
  id: 'crackers',
  DOMRef: 'thing',
  easingType: 'easeInOutQuad'
});
lrTitleKeyframes.addKeyframe({
  // posType: '#',
  tlPos: 0,
  data: {
    left: 256,
    top: 0
  }
});
lrTitleKeyframes.addKeyframe({
  // posType: '#',
  tlPos: 20,
  data: {
    left: 150,
    top: 50
  }
});
lrTitleKeyframes.addKeyframe({
  // posType: '#',
  tlPos: 35,
  data: {
    left: 400,
    top: 25
  }
});
lrTitleKeyframes.addKeyframe({
  // posType: '#',
  tlPos: 90,
  data: {
    left: 30,
    top: 0
  }
});

var KeyframeTimeline = React.createClass({
  mixins: [tweenState.Mixin],

  getInitialState: function() {
    return {
      lrTitle: lrTitleKeyframes.getTween(0),
      sliderValue: '0'
    };
  },

  render: function() {

    var left = Math.floor(this.getTweeningValue(function(state) {
      return state.lrTitle
    }, 'left'));

    var top = Math.floor(this.getTweeningValue(function(state) {
      return state.lrTitle
    }, 'top'));

    return (
      <div style={{margin: '40px'}}>
        <h1>KeyframeCollection</h1>
        <h5>sliderValue: {this.state.sliderValue}</h5>
        <input style={{width: '400'}} type="range" name="left" min="0" max="100" value={this.state.sliderValue} onChange={this.handleSliderChange}></input>
        <h5 style={{marginLeft: ''+left, marginTop: ''+top}} onClick={this.handleLinkClick}>left: {left} | top: {top} </h5>
      </div>
    );
  },

  transitionProp: function(fn, prop, targetValue, easingType) {
    var easingType = easingType || tweenState.easingTypes.linear;
    this.tweenState(fn, prop, {
      easing: easingType,
      duration: 500,
      endValue: targetValue
    });
  },

  // handleSliderChange: function(e) {
    // THIS PASSES KEYFRAME COLLECTION DATA INTO REACT-TWEEN-STATE
    // WATCH OUT!! R-T-S EASING FNS ARE SHITTY AND NEED REFACTORING
    // DIVIDE BY ZERO N STUFF. (FOR NOW OUT-ELASTIC IS MONKEY PATCHED)
    // ALSO, SET DEFAULT EASING IN KEYFRAME COLL CONFIG TO LINEAR TO
    // AVOID STACKED EASING.
  //   e.preventDefault;
  //   this.setState({
  //     sliderValue: e.target.value
  //   });
  //   var tweenResultObj = lrTitleKeyframes.getTween(e.target.value);
  //   this.transitionProp(function(state) {return state.lrTitle}, 'left', tweenResultObj.left);
  //   this.transitionProp(function(state) {return state.lrTitle}, 'top', tweenResultObj.top);
  // },

  handleSliderChange: function(e) {
    // THIS IS THE HARDWIRED VERSION. SET EASING IN KEYFRAME COLLECTION TO
    // YOUR FAVORITE FLAVOR.
    e.preventDefault;
    this.setState({
      lrTitle: lrTitleKeyframes.getTween(e.target.value),
      sliderValue: e.target.value
    });
  },

  handleLinkClick: function(e) {
    e.preventDefault;
    this.setState({
      sliderValue: 0
    });
    this.transitionProp(function(state) {return state.rlTitle}, 'left', 0);
    this.transitionProp(function(state) {return state.rlTitle}, 'top', 0);
  },

});

module.exports = KeyframeTimeline;