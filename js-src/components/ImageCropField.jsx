/* global jQuery */
import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import MoveTool from "./MoveTool.jsx";
import SelectionTool from "./SelectionTool.jsx";
import ZoominTool from "./ZoominTool.jsx";
import ZoomoutTool from "./ZoomoutTool.jsx";
import ResetTool from "./ResetTool.jsx";
import SavecroppedTool from "./SavecroppedTool.jsx";

class ImageCropField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };

    this.handleSave = this.handleSave.bind(this);
  }

  handleSave(e) {
    // const form = e.target.closest("form");
    // let formUrl = form.getAttribute("action");
    // let url =
    //   encodeURI(formUrl) +
    //   "/field/" +
    //   e.target.closest(".imagecrop-field").getAttribute("name") +
    //   "/cropImage";
    // //find the cropper
    // let target = e.target
    //   .closest(".imagecrop-field")
    //   .querySelector(".imagecrop-field-selection");
    this.setState({
      loading: true,
    });
  }

  /**
   * Handles rendering the button
   */
  render() {
    let loadingSpinner = null;
    if (this.state.loading) {
      // const Loading = this.props.LoadingComponent;
      loadingSpinner = loading;
    }

    return (
      <div class="imagecrop-field" name={this.props.data.name}>
        {loadingSpinner}
        <div class="imagecrop-field-toolbar">
          <MoveTool></MoveTool>
          <SelectionTool></SelectionTool>
          <ZoominTool></ZoominTool>
          <ZoomoutTool></ZoomoutTool>
          <ResetTool></ResetTool>
          <SavecroppedTool onClick={e => this.handleSave(e)}></SavecroppedTool>
        </div>
        <div class="img-container">
          <img
            class="imagecrop-field-selection"
            src={this.props.data.image}
          ></img>
        </div>
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
        responsive: true,
        minContainerWidth: 542,
        minContainerHeight: 500,
      });
    },
  });
});
