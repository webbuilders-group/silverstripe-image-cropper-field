import React, { Component } from "react";

class Dimensions extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const width = this.props.selectedWidth;
    const height = this.props.selectedHeight;
    return (
      <div class="image-crop-dimensions">
        {" "}
        Width: <span>{width}px</span> Height: <span>{height}px</span>
      </div>
    );
  }
}

export default Dimensions;
