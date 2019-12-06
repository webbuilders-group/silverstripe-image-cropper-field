import React, { Component } from "react";

class AspectRatioButton extends Component {
  render() {
    let extra = "";
    //is the name of this element the same as the currently active element
    if (this.props.extraClasses === this.props.name) {
      extra = "active";
    }
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
