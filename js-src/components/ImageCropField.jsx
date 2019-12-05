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
import ReactTooltip from "react-tooltip";

class ImageCropField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      cropper: null,
      activeButton: {
        moveTool: null,
        selectionTool: "active",
      },
      cropper: null,
    };

    //bindings
    this.handleSave = this.handleSave.bind(this);
    this.moveTool = this.moveTool.bind(this);
    this.selectionTool = this.selectionTool.bind(this);
    this.resetTool = this.resetTool.bind(this);
    this.zoominTool = this.zoominTool.bind(this);
    this.zoomoutTool = this.zoomoutTool.bind(this);
  }

  /*
   * when the component has been fully loaded
   */
  componentDidMount(e) {
    let image = ReactDOM.findDOMNode(this.refs.image);

    //store the cropper in a state
    let cropper = this.state.cropper;
    cropper = new Cropper(image, {
      responsive: true,
      minContainerWidth: 542,
      minContainerHeight: 500,
    });

    this.setState({ cropper });
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
    let cropper = this.state.cropper;

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

      //reload
      location.reload();
    });
  }

  /**
   * Trigger the move tool
   */
  moveTool(e) {
    //find the cropper
    let cropper = this.state.cropper;
    //trigger the move tool
    cropper.setDragMode("move");
    //reset active buttons
    this.clearActiveButtons();
    this.setActiveButton("moveTool");
  }

  /**
   * Trigger the selection tool
   */
  selectionTool(e) {
    //find the cropper
    let cropper = this.state.cropper;
    //trigger the crop/selection tool
    cropper.setDragMode("crop");
    //reset active buttons
    this.clearActiveButtons();
    this.setActiveButton("selectionTool");
  }

  /**
   * Reset the cropper field
   */
  resetTool(e) {
    //find the cropper
    let cropper = this.state.cropper;
    //reset
    cropper.reset();
  }

  /**
   * zoom in
   */
  zoominTool(e) {
    //find the cropper
    let cropper = this.state.cropper;
    //zoom in
    cropper.zoom("0.1");
  }

  /**
   * zoom in
   */
  zoomoutTool(e) {
    //find the cropper
    let cropper = this.state.cropper;
    //zoom in
    cropper.zoom("-0.1");
  }

  clearActiveButtons() {
    let buttons = this.state.activeButton;
    //set all to false
    for (let [key, value] of Object.entries(buttons)) {
      buttons[key] = null;
    }
    this.setState({ buttons });
  }

  setActiveButton(act) {
    //set the button active
    let button = this.state.activeButton;
    button[act] = "active";
    this.setState({ button });
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
        <ReactTooltip />
        <div class="imagecrop-field-toolbar">
          <MoveTool
            onClick={e => this.moveTool(e)}
            extraClasses={this.state.activeButton.moveTool}
          />
          <SelectionTool
            onClick={e => this.selectionTool(e)}
            extraClasses={this.state.activeButton.selectionTool}
          />
          <ZoominTool onClick={e => this.zoominTool(e)}></ZoominTool>
          <ZoomoutTool onClick={e => this.zoomoutTool(e)} />
          <ResetTool onClick={e => this.resetTool(e)} />
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
