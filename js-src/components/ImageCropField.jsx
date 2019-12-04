/* global jQuery */
import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Input } from "reactstrap";
import MoveTool from "./MoveTool.jsx";
import SelectionTool from "./SelectionTool.jsx";
import ZoominTool from "./ZoominTool.jsx";
import ZoomoutTool from "./ZoomoutTool.jsx";

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
          <span class="imagecrop-field-reset-tool tool-on">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
            >
              <path d="M16.728 20.644l1.24 1.588c-1.721 1.114-3.766 1.768-5.969 1.768-4.077 0-7.626-2.225-9.524-5.52l-1.693.982 1.09-4.1 4.101 1.089-1.747 1.014c1.553 2.699 4.442 4.535 7.773 4.535 1.736 0 3.353-.502 4.729-1.356zm-13.722-7.52l-.007-.124c0-4.625 3.51-8.433 8.003-8.932l-.002 1.932 3.004-2.996-2.994-3.004-.004 2.05c-5.61.503-10.007 5.21-10.007 10.95l.021.402 1.986-.278zm18.577 5.243c.896-1.588 1.416-3.414 1.416-5.367 0-4.577-2.797-8.499-6.773-10.156l-.623 1.914c3.173 1.393 5.396 4.561 5.396 8.242 0 1.603-.441 3.097-1.18 4.402l-1.762-.964 1.193 4.072 4.071-1.192-1.738-.951z" />
            </svg>
          </span>
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

  //handle reset
  $(".imagecrop-field-reset-tool").entwine({
    onclick: function(e) {
      //get the proper edit form so we can have multiple image selection fields
      let target = this.parent()
        .parent()
        .find(".imagecrop-field-selection");

      //toggle crop mode
      target.cropper("reset");

      $(this)._super();
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
