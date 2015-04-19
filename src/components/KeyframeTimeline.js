var React = require('react');
var tweenState = require('react-tween-state');
var Timeline = require('../helpers/timeline.js');
var KeyframeCollection = require('../helpers/keyframe_collection.js');

var testKeyframes = new KeyframeCollection({
  // tlStart: 15,
  // tlEnd: 60,
  id: 'crackers',
  DOMRef: 'thing'
});
testKeyframes.addKeyframe({
  // posType: '#',
  tlPos: 0,
  data: {
    left: 256
  }
});
testKeyframes.addKeyframe({
  // posType: '#',
  tlPos: 55,
  data: {
    left: 200
  }
});
testKeyframes.addKeyframe({
  // posType: '#',
  tlPos: 30,
  data: {
    left: 150
  }
});
testKeyframes.addKeyframe({
  // posType: '#',
  tlPos: 100,
  data: {
    left: 30
  }
});

var KeyframeTimeline = React.createClass({
  mixins: [tweenState.Mixin],

  getInitialState: function() {
    return {
      left: testKeyframes.getTween(0),
      sliderValue: '0'
    };
  },

  render: function() {

    var left = Math.floor(this.getTweeningValue('left'));

    return (
      <div style={{margin: '40px'}}>
        <h1>KeyframeCollection</h1>
        <h5>sliderValue: {this.state.sliderValue}</h5>
        <h5 style={{marginLeft: ''+left}} onClick={this.handleLinkClick}>left: {this.state.left} </h5>
        <input style={{width: '400'}} type="range" name="left" min="0" max="100" value={this.state.sliderValue} onChange={this.handleSliderChange}></input>
      </div>
    );
  },

  transitionProp: function(prop, targetValue, easingType) {
    var easingType = easingType || tweenState.easingTypes.easeOutElastic;
    this.tweenState(prop, {
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
    this.transitionProp('left', testKeyframes.getTween(parseInt(e.target.value)));
  },

  handleLinkClick: function(e) {
    e.preventDefault;
    this.setState({
      sliderValue: 0
    });
    this.transitionProp('left', 0);
  },

});

module.exports = KeyframeTimeline;