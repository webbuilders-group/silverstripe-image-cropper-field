/* global jQuery */
import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Input } from "reactstrap";

class ImageCropField extends Component {
  constructor(props) {
    super(props);

    console.log(props);
  }

  /**
   * Handles rendering the button
   */
  render() {
    return (
      <div class="imagecrop-field">
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
jQuery.entwine("lenovo", function($) {
  $(".imagecrop-field-selection").entwine({
    onmatch: function() {
      //get the image url
      // let imageURL = $(".editor__file-preview-link").attr("href");

      // $(this).attr("src", imageURL);

      console.log("jquery working");
    },
  });
});
