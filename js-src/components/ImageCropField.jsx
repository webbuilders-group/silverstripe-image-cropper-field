/* global jQuery */
import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import classnames from "classnames";
import MoveTool from "./MoveTool.jsx";
import SelectionTool from "./SelectionTool.jsx";
import ZoominTool from "./ZoominTool.jsx";
import ZoomoutTool from "./ZoomoutTool.jsx";
import ResetTool from "./ResetTool.jsx";
import SavecroppedTool from "./SavecroppedTool.jsx";
import Cropper from "../assets/cropper.min.js";

class ImageCropField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      cropper: null,
    };

    this.handleSave = this.handleSave.bind(this);
  }

  /*
   * when the component has been fully loaded
   */
  componentDidMount(e) {
    let image = ReactDOM.findDOMNode(this.refs.image);

    this.props.cropper = new Cropper(image, {
      responsive: true,
      minContainerWidth: 542,
      minContainerHeight: 500,
    });
  }

  /**
   * handle saving the cropped image
   */
  handleSave(e) {
    const form = e.target.closest("form");
    let formUrl = form.getAttribute("action");
    let self = this;
    let url =
      encodeURI(formUrl) +
      "/field/" +
      e.target.closest(".imagecrop-field").getAttribute("name") +
      "/cropImage";

    //find the cropper
    let cropper = this.props.cropper;

    //the cropped image
    let data = {
      image: cropper.getCroppedCanvas().toDataURL(),
    };

    //add loading
    this.setState({
      loading: true,
    });

    this.postAjax(url, data, function(data) {
      console.log(data);

      //remove loading
      self.setState({
        loading: false,
      });
    });
  }

  /**
   * allows us to make simple post request
   */
  postAjax(url, data, success) {
    var params =
      typeof data == "string"
        ? data
        : Object.keys(data)
            .map(function(k) {
              return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
            })
            .join("&");

    var xhr = window.XMLHttpRequest
      ? new XMLHttpRequest()
      : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open("POST", url);
    xhr.onreadystatechange = function() {
      if (xhr.readyState > 3 && xhr.status == 200) {
        success(xhr.responseText);
      }
    };
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(params);
    return xhr;
  }

  /**
   * Handles rendering the button
   */
  render() {
    let loadingSpinner = null;
    if (this.state.loading) {
      // const Loading = this.props.LoadingComponent;
      loadingSpinner = "loading";
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
            ref="image"
          ></img>
        </div>
      </div>
    );
  }
}

export default ImageCropField;
