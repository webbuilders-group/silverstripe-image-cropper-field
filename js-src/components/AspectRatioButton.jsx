import React, { Component } from "react";

class AspectRatioButton extends Component {
  render() {
    let extra = this.props.extraClasses;
    let classes = "imagecrop-field-aspect-ratio-option " + extra;

    return (
      <span
        class={classes}
        onClick={this.props.onClick}
        data-tip={this.props.dataTip}
      >
        {this.props.children}
      </span>
    );
  }
}

export default AspectRatioButton;
