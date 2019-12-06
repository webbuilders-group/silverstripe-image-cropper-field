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
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

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
      showModal: false,
      preview: null,
    };

    //bindings
    this.handleSave = this.handleSave.bind(this);
    this.moveTool = this.moveTool.bind(this);
    this.selectionTool = this.selectionTool.bind(this);
    this.resetTool = this.resetTool.bind(this);
    this.zoominTool = this.zoominTool.bind(this);
    this.zoomoutTool = this.zoomoutTool.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  /*
   * when the component has been fully loaded
   */
  componentDidMount(e) {
    let image = ReactDOM.findDOMNode(this.refs.image);
    let self = this;
    //store the cropper in a state
    let cropper = this.state.cropper;
    cropper = new Cropper(image, {
      responsive: true,
      minContainerWidth: 542,
      minContainerHeight: 500,
    });

    this.setState({ cropper });
  }

  toggleModal() {
    //find the cropper
    let cropper = this.state.cropper;

    this.setState({
      showModal: !this.state.showModal,
      preview: cropper.getCroppedCanvas().toDataURL(),
    });
  }

  /**
   * handle saving the cropped image
   */
  handleSave() {
    const form = ReactDOM.findDOMNode(this.refs.image).closest("form");
    let formUrl = form.getAttribute("action");
    let self = this;
    let url =
      encodeURI(formUrl) +
      "/field/" +
      ReactDOM.findDOMNode(this.refs.image)
        .closest(".imagecrop-field")
        .getAttribute("name") +
      "/cropImage";

    //find the cropper
    let cropper = this.state.cropper;

    //#Form_fileEditForm_Name
    let fieldName = ReactDOM.findDOMNode(this.refs.image)
      .closest("form")
      .querySelector("#Form_fileEditForm_Name").value;
    //remove the period
    fieldName = fieldName.substring(0, fieldName.indexOf("."));

    //the cropped image
    let data = {
      image: cropper.getCroppedCanvas().toDataURL(),
      width: cropper.getData()["width"].toFixed(),
      height: cropper.getData()["height"].toFixed(),
      name: fieldName,
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
        <Modal isOpen={this.state.showModal} toggle={() => this.toggleModal()}>
          <ModalHeader toggle={() => this.toggleModal()}>
            Modal title
          </ModalHeader>
          <ModalBody>
            <img src={this.state.preview} />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => this.handleSave()}>
              Crop
            </Button>
            <Button color="secondary" onClick={() => this.toggleModal()}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
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
          <SavecroppedTool onClick={() => this.toggleModal()}></SavecroppedTool>
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
