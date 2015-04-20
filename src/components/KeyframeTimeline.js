var React = require('react');
var tweenState = require('react-tween-state');
var Timeline = require('../helpers/timeline.js');
var KeyframeCollection = require('../helpers/keyframe_collection.js');

var lrTitleKeyframes = new KeyframeCollection({
  // tlStart: 15,
  // tlEnd: 60,
  id: 'crackers',
  DOMRef: 'thing'
});
lrTitleKeyframes.addKeyframe({
  // posType: '#',
  tlPos: 20,
  data: {
    left: 256,
    top: 0
  }
});
lrTitleKeyframes.addKeyframe({
  // posType: '#',
  tlPos: 30,
  data: {
    left: 150,
    top: 50
  }
});
lrTitleKeyframes.addKeyframe({
  // posType: '#',
  tlPos: 55,
  data: {
    left: 400,
    top: 25
  }
});
lrTitleKeyframes.addKeyframe({
  // posType: '#',
  tlPos: 80,
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
      // left: lrTitleKeyframes.getTween(0),
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

    // if (top !== top) {
    //   debugger;
    // }

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
    var easingType = easingType || tweenState.easingTypes.easeOutElastic;
    this.tweenState(fn, prop, {
      easing: easingType,
      duration: 500,
      endValue: targetValue
    });
  },

  handleSliderChange: function(e) {
    e.preventDefault;
    this.setState({
      sliderValue: e.target.value
    });
    var tweenResultObj = lrTitleKeyframes.getTween(e.target.value);
    this.transitionProp(function(state) {return state.lrTitle}, 'left', tweenResultObj.left);
    this.transitionProp(function(state) {return state.lrTitle}, 'top', tweenResultObj.top);
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