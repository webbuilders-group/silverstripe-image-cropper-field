import React, { Component } from "react";

class SavecroppedTool extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <span
        class="imagecrop-field-savecropped-tool tool-on"
        data-tip="Save the cropped image to the Cropped folder"
        onClick={this.props.onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
        >
          <path d="M15.003 3h2.997v5h-2.997v-5zm8.997 1v20h-24v-24h20l4 4zm-19 5h14v-7h-14v7zm16 4h-18v9h18v-9z" />
        </svg>
      </span>
    );
  }
}

export default SavecroppedTool;
