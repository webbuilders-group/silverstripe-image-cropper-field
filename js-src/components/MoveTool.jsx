import React, { Component } from "react";

class MoveTool extends Component {
  render() {
    let extra = this.props.extraClasses;
    let classes = "imagecrop-field-selection-tool tool-on " + extra;

    return (
      <span class={classes} onClick={this.props.onClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
        >
          <path d="M12 10c1.104 0 2 .896 2 2s-.896 2-2 2-2-.896-2-2 .896-2 2-2zm-3.857 3c-.084-.321-.143-.652-.143-1s.059-.679.143-1h-2.143v-4l-6 5 6 5v-4h2.143zm7.714-2c.084.321.143.652.143 1s-.059.679-.143 1h2.143v4l6-5-6-5v4h-2.143zm-2.857 4.857c-.321.084-.652.143-1 .143s-.679-.059-1-.143v2.143h-4l5 6 5-6h-4v-2.143zm-2-7.714c.321-.084.652-.143 1-.143s.679.059 1 .143v-2.143h4l-5-6-5 6h4v2.143z" />
        </svg>
      </span>
    );
  }
}

export default MoveTool;
