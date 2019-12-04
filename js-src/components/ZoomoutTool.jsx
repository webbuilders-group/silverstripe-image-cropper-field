/* global jQuery */
import React, { Component } from "react";

class ZoomoutTool extends Component {
  render() {
    return (
      <span class="imagecrop-field-zoomout-tool tool-on">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
        >
          <path d="M13 10h-8v-2h8v2zm8.172 14l-7.387-7.387c-1.388.874-3.024 1.387-4.785 1.387-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9c0 1.761-.514 3.398-1.387 4.785l7.387 7.387-2.828 2.828zm-12.172-8c3.859 0 7-3.14 7-7s-3.141-7-7-7-7 3.14-7 7 3.141 7 7 7z" />
        </svg>
      </span>
    );
  }
}

export default ZoomoutTool;

// jquery to handle the image field
jQuery.entwine("ImageCropZoomoutTool", function($) {
  //handle zoom out tool
  $(".imagecrop-field-zoomout-tool").entwine({
    onclick: function(e) {
      //get the proper edit form so we can have multiple image selection fields
      let target = this.parent()
        .parent()
        .find(".imagecrop-field-selection");

      //toggle crop mode
      target.cropper("zoom", "-0.1");

      $(this)._super();
    },
  });
});
