/* global jQuery */
import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Input } from "reactstrap";
import MoveTool from "./MoveTool.jsx";
import SelectionTool from "./SelectionTool.jsx";
import ZoominTool from "./ZoominTool.jsx";
import ZoomoutTool from "./ZoomoutTool.jsx";
import ResetTool from "./ResetTool.jsx";
import SavecroppedTool from "./SavecroppedTool.jsx";

class ImageCropField extends Component {
  constructor(props) {
    super(props);
  }

  /**
   * Handles rendering the button
   */
  render() {
    return (
      <div class="imagecrop-field" name={this.props.data.name}>
        <div class="imagecrop-field-toolbar">
          <MoveTool></MoveTool>
          <SelectionTool></SelectionTool>
          <ZoominTool></ZoominTool>
          <ZoomoutTool></ZoomoutTool>
          <ResetTool></ResetTool>
          <SavecroppedTool></SavecroppedTool>
        </div>
        <img
          class="imagecrop-field-selection"
          src={this.props.data.image}
        ></img>
      </div>
    );
  }
}

export default ImageCropField;

// jquery to handle the image field
jQuery.entwine("ImageCropMain", function($) {
  //handle adding the field to the image
  $(".imagecrop-field-selection").entwine({
    onmatch: function() {
      //add the cropper to the image
      $(this).cropper({
        responsive: false,
        minContainerWidth: 542,
        minContainerHeight: 500,
      });
    },
    disappear: function() {
      console.log("test");
    },
  });
});
