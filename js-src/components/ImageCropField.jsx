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
          <span
            class="imagecrop-field-savecropped-tool tool-on"
            alt="Create cropped image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
            >
              <path d="M22 4v16h-20v-16h20zm2-2h-24v20h24v-20zm-5 13.092v-6.184c.581-.207 1-.756 1-1.408 0-.828-.672-1.5-1.5-1.5-.652 0-1.201.419-1.408 1h-10.184c-.207-.581-.756-1-1.408-1-.828 0-1.5.672-1.5 1.5 0 .652.419 1.201 1 1.408v6.184c-.581.207-1 .756-1 1.408 0 .828.672 1.5 1.5 1.5.652 0 1.201-.419 1.408-1h10.184c.207.581.756 1 1.408 1 .828 0 1.5-.672 1.5-1.5 0-.652-.419-1.201-1-1.408zm-1.908.908h-10.184c-.15-.424-.484-.757-.908-.908v-6.184c.424-.151.757-.484.908-.908h10.184c.151.424.484.757.908.908v6.184c-.424.151-.758.484-.908.908zm-9.092-6c0-.552.448-1 1-1s1 .448 1 1-.448 1-1 1-1-.448-1-1zm8 5l-2.75-5-1.891 2.984-1.359-1.312-2 3.328h8z" />
            </svg>
          </span>
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
  });

  //save tool
  $(".imagecrop-field-savecropped-tool").entwine({
    onclick: function(e) {
      //get the form
      const form = this.parents("form");
      let formUrl = form.attr("action");
      let url = `${encodeURI(formUrl)}/field/${this.parent()
        .parent()
        .attr("name")}/cropImage`;
      let target = this.parent()
        .parent()
        .find(".imagecrop-field-selection");

      //testing
      // $(".asset-dropzone.flexbox-area-grow").html(
      //   target.cropper("getCroppedCanvas")
      // );

      $.ajax({
        type: "POST",
        url: url,
        data: {
          image: target
            .cropper("getCroppedCanvas", { maxWidth: 4096, maxHeight: 4096 })
            .toDataURL(),
        },
        success: function(resultData) {
          //results
          let result = JSON.parse(resultData);

          //did it finish successfully on the php side?
          if (result.status === "complete") {
            console.log(result.status);
          }
        },
      });
    },
  });
});
