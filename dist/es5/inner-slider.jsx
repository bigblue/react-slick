"use strict";

var React = require("react");
var cloneWithProps = require("react/lib/cloneWithProps");
var classnames = require("classnames");
var EventHandlersMixin = require("./mixins/event-handlers");
var HelpersMixin = require("./mixins/helpers");
var initialState = require("./initial-state");
var defaultProps = require("./default-props");
var _assign = require("lodash.assign");

var Slider = React.createClass({
  displayName: "Slider",

  mixins: [EventHandlersMixin, HelpersMixin],
  getInitialState: function getInitialState() {
    return initialState;
  },
  getDefaultProps: function getDefaultProps() {
    return defaultProps;
  },
  componentDidMount: function componentDidMount() {
    this.initialize(this.props);
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.initialize(nextProps);
  },
  renderDots: function renderDots() {
    var dotOptions;
    var dots = [];
    if (this.props.dots === true && this.state.slideCount > this.props.slidesToShow) {
      for (var i = 0; i <= this.getDotCount(); i += 1) {
        var className = classnames({
          "slick-active": this.state.currentSlide === i * this.props.slidesToScroll });
        dotOptions = {
          message: "index",
          index: i
        };
        dots.push(React.createElement(
          "li",
          { key: i, className: className },
          React.createElement(
            "button",
            { onClick: this.changeSlide.bind(this, dotOptions) },
            i
          )
        ));
      }
      return React.createElement(
        "ul",
        { className: this.props.dotsClass, style: { display: "block" } },
        dots
      );
    } else {
      return null;
    }
  },
  renderSlides: function renderSlides() {
    var key;
    var slides = [];
    var preCloneSlides = [];
    var postCloneSlides = [];
    var count = React.Children.count(this.props.children);
    React.Children.forEach(this.props.children, (function (child, index) {
      var infiniteCount;
      slides.push(cloneWithProps(child, {
        key: index,
        "data-index": index,
        className: this.getSlideClasses(index),
        style: _assign({}, this.getSlideStyle(), child.props.style) }));

      if (this.props.infinite === true) {
        if (this.props.centerMode === true) {
          infiniteCount = this.props.slidesToShow + 1;
        } else {
          infiniteCount = this.props.slidesToShow;
        }

        if (index >= count - infiniteCount) {
          key = -(count - index);
          preCloneSlides.push(cloneWithProps(child, {
            key: key,
            "data-index": key,
            className: this.getSlideClasses(key),
            style: _assign({}, this.getSlideStyle(), child.props.style) }));
        }

        if (index < infiniteCount) {
          key = count + index;
          postCloneSlides.push(cloneWithProps(child, {
            key: key,
            "data-index": key,
            className: this.getSlideClasses(key),
            style: _assign({}, this.getSlideStyle(), child.props.style) }));
        }
      }
    }).bind(this));

    return preCloneSlides.concat(slides, postCloneSlides);
  },
  renderTrack: function renderTrack() {
    return React.createElement(
      "div",
      { ref: "track", className: "slick-track", style: this.state.trackStyle },
      this.renderSlides()
    );
  },
  renderArrows: function renderArrows() {
    if (this.props.arrows === true) {
      var prevClasses = { "slick-prev": true };
      var nextClasses = { "slick-next": true };
      var prevHandler = this.changeSlide.bind(this, { message: "previous" });
      var nextHandler = this.changeSlide.bind(this, { message: "next" });

      if (this.props.infinite === false) {
        if (this.state.currentSlide === 0) {
          prevClasses["slick-disabled"] = true;
          prevHandler = null;
        }

        if (this.props.centerMode && !this.props.infinite) {
          if (this.state.currentSlide >= this.state.slideCount - 1) {
            nextClasses["slick-disabled"] = true;
            nextHandler = null;
          }
        } else {
          if (this.state.currentSlide >= this.state.slideCount - this.props.slidesToShow) {
            nextClasses["slick-disabled"] = true;
            nextHandler = null;
          }
        }
      }

      var prevArrow = React.createElement(
        "button",
        { key: 0, ref: "previous", type: "button", "data-role": "none", className: classnames(prevClasses), style: { display: "block" }, onClick: prevHandler },
        " Previous"
      );
      var nextArrow = React.createElement(
        "button",
        { key: 1, ref: "next", type: "button", "data-role": "none", className: classnames(nextClasses), style: { display: "block" }, onClick: nextHandler },
        "Next"
      );
      return [prevArrow, nextArrow];
    } else {
      return null;
    }
  },
  render: function render() {
    var className = classnames("slick-initialized", "slick-slider", this.props.className);
    return React.createElement(
      "div",
      { className: className },
      React.createElement(
        "div",
        {
          ref: "list",
          className: "slick-list",
          style: this.getListStyle(),
          onMouseDown: this.swipeStart,
          onMouseMove: this.state.dragging ? this.swipeMove : null,
          onMouseUp: this.swipeEnd,
          onMouseLeave: this.state.dragging ? this.swipeEnd : null,
          onTouchStart: this.swipeStart,
          onTouchMove: this.state.dragging ? this.swipeMove : null,
          onTouchEnd: this.swipeEnd,
          onTouchCancel: this.state.dragging ? this.swipeEnd : null },
        this.renderTrack()
      ),
      this.renderArrows(),
      this.renderDots()
    );
  }
});

module.exports = Slider;