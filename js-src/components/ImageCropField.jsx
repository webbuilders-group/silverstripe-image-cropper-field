/* global jQuery */
import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Input } from "reactstrap";

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
          <span class="imagecrop-field-move-tool tool-on">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
            >
              <path d="M12 10c1.104 0 2 .896 2 2s-.896 2-2 2-2-.896-2-2 .896-2 2-2zm-3.857 3c-.084-.321-.143-.652-.143-1s.059-.679.143-1h-2.143v-4l-6 5 6 5v-4h2.143zm7.714-2c.084.321.143.652.143 1s-.059.679-.143 1h2.143v4l6-5-6-5v4h-2.143zm-2.857 4.857c-.321.084-.652.143-1 .143s-.679-.059-1-.143v2.143h-4l5 6 5-6h-4v-2.143zm-2-7.714c.321-.084.652-.143 1-.143s.679.059 1 .143v-2.143h4l-5-6-5 6h4v2.143z" />
            </svg>
          </span>
          <span class="imagecrop-field-selection-tool tool-on active">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
            >
              <path d="M20 18v-14h-14v-4h-2v4h-4v2h4v14h14v4h2v-4h4v-2h-4zm-2-9h-3v-3h3v3zm-8 5v-4h4v4h-4zm4 1v3h-4v-3h4zm-5-1h-3v-4h3v4zm1-5v-3h4v3h-4zm5 1h3v4h-3v-4zm-6-4v3h-3v-3h3zm-3 9h3v3h-3v-3zm9 3v-3h3v3h-3z" />
            </svg>
          </span>
          <span class="imagecrop-field-zoomin-tool tool-on">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
            >
              <path d="M13 10h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2zm8.172 14l-7.387-7.387c-1.388.874-3.024 1.387-4.785 1.387-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9c0 1.761-.514 3.398-1.387 4.785l7.387 7.387-2.828 2.828zm-12.172-8c3.859 0 7-3.14 7-7s-3.141-7-7-7-7 3.14-7 7 3.141 7 7 7z" />
            </svg>
          </span>
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
jQuery.entwine("lenovo", function($) {
  //handle adding the field to the image
  $(".imagecrop-field-selection").entwine({
    onmatch: function() {
      //add the cropper to the image
      $(this).cropper({
        responsive: false,
        minContainerWidth: 542,
        minContainerHeight: 500,
        scalable: true,
      });
    },
  });
  //handle the move tool
  $(".imagecrop-field-move-tool").entwine({
    onclick: function(e) {
      //get the proper edit form so we can have multiple image selection fields
      let target = this.parent()
        .parent()
        .find(".imagecrop-field-selection");

      //toggle move mode
      target.cropper("setDragMode", "move");

      //update the active icon
      $(this)
        .parent()
        .parent()
        .find(".imagecrop-field-toolbar > span")
        .each(function() {
          $(this).removeClass("active");
        });

      $(this).addClass("active");

      $(this)._super();
    },
  });
  //handle the selection tool
  $(".imagecrop-field-selection-tool").entwine({
    onclick: function(e) {
      //get the proper edit form so we can have multiple image selection fields
      let target = this.parent()
        .parent()
        .find(".imagecrop-field-selection");

      //toggle crop mode
      target.cropper("setDragMode", "crop");

      //update the active icon
      $(this)
        .parent()
        .parent()
        .find(".imagecrop-field-toolbar > span")
        .each(function() {
          $(this).removeClass("active");
        });

      $(this).addClass("active");

      $(this)._super();
    },
  });
  //handle zoom in tool
  $(".imagecrop-field-zoomin-tool").entwine({
    onclick: function(e) {
      //get the proper edit form so we can have multiple image selection fields
      let target = this.parent()
        .parent()
        .find(".imagecrop-field-selection");

      //toggle crop mode
      target.cropper("zoom", "0.1");

      $(this)._super();
    },
  });
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
