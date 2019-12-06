import React, { Component } from "react";

class ToolbarButton extends Component {
  render() {
    let extra = this.props.extraClasses;
    let name = this.props.name;
    let classes = "imagecrop-field-" + name + " tool-on " + extra;

    return (
      <span
        class={classes}
        onClick={this.props.onClick}
        data-tip={this.props.datatip}
      >
        {this.props.children}
      </span>
    );
  }
}

export default ToolbarButton;
