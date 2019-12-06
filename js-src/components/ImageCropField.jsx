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
import Dimensions from "./Dimensions.jsx";
import AspectRatio from "./AspectRatio.jsx";
import AspectRatioButton from "./AspectRatioButton.jsx";
import Cropper from "../assets/cropper.min.js";
import ReactTooltip from "react-tooltip";
import {
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
} from "reactstrap";

class ImageCropField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAlertMessage: false,
      cropper: null,
      activeButton: {
        moveTool: null,
        selectionTool: "active",
      },
      cropper: null,
      showModal: false,
      preview: null,
      alertMessageLink: null,
      selectedWidth: null,
      selectedHeight: null,
      cropButtonClass: "font-icon-rocket",
      cropButtonColor: "primary",
      customAspectRatio: "",
    };

    //bindings
    this.handleSave = this.handleSave.bind(this);
    this.moveTool = this.moveTool.bind(this);
    this.selectionTool = this.selectionTool.bind(this);
    this.resetTool = this.resetTool.bind(this);
    this.zoominTool = this.zoominTool.bind(this);
    this.zoomoutTool = this.zoomoutTool.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleAspectChange = this.handleAspectChange.bind(this);
    this.setCustomAspectRatio = this.setCustomAspectRatio.bind(this);
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
      crop(event) {
        self.setState({
          selectedWidth: event.detail.width.toFixed(),
          selectedHeight: event.detail.height.toFixed(),
        });
      },
    });

    this.setState({ cropper });
  }

  toggleModal() {
    //find the cropper
    let cropper = this.state.cropper;

    this.setState({
      showModal: !this.state.showModal,
      preview: cropper.getCroppedCanvas().toDataURL(),
      showAlertMessage: null,
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

    this.setState({
      cropButtonClass: "font-icon-dot-3",
      cropButtonColor: "outline-primary",
    });

    //send the data to be processed
    this.postAjax(url, data, function(data) {
      let d = JSON.parse(data);

      //close the modal and show the message
      self.setState({
        showAlertMessage: true,
        alertMessageLink: d.link,
        cropButtonClass: "font-icon-tick",
      });
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
    //set the aspect ratio to none
    this.setAspectRatio(NaN, true);
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

  /**
   * clear all active buttons
   */
  clearActiveButtons() {
    let buttons = this.state.activeButton;
    //set all to false
    for (let [key, value] of Object.entries(buttons)) {
      buttons[key] = null;
    }
    this.setState({ buttons });
  }

  /**
   * set the currently active button
   */
  setActiveButton(act) {
    //set the button active
    let button = this.state.activeButton;
    button[act] = "active";
    this.setState({ button });
  }

  setAspectRatio(number, clearCustom = false) {
    //find the cropper
    let cropper = this.state.cropper;

    //clear the customAspectRatio state if clear custom is set to true
    if (clearCustom) {
      this.setState({
        customAspectRatio: "",
      });
    }

    //set aspect ratio
    cropper.setAspectRatio(number);
  }

  /**
   * handle changes to the custom aspect ratio field
   */
  handleAspectChange(e) {
    this.setState({ customAspectRatio: e.target.value });
  }

  /**
   * allows the user to set a custom aspect.
   * uses the customAspectRatio state
   */
  setCustomAspectRatio() {
    let requestedAR = this.state.customAspectRatio;
    let newData = requestedAR.split(":");
    //set the aspect ratio
    this.setAspectRatio(newData[0] / newData[1]);
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
   * Handles rendering the field
   */
  render() {
    let AlertMessage = null;
    if (this.state.showAlertMessage) {
      //show the alert message
      AlertMessage = (
        <Alert color="success">
          Your image has been saved. Click{" "}
          <a href={this.state.alertMessageLink}>here</a> to edit it.
        </Alert>
      );
    }

    return (
      <div class="imagecrop-field" name={this.props.data.name}>
        <ReactTooltip />
        <Modal
          isOpen={this.state.showModal}
          toggle={() => this.toggleModal()}
          className="crop-preview"
        >
          <ModalHeader toggle={() => this.toggleModal()}>
            Crop Preview
          </ModalHeader>
          <ModalBody>
            {AlertMessage}
            <div class="image-crop-preview">
              <img src={this.state.preview} />
            </div>
            <div class="image-crop-notes">
              <span class="small">
                <Dimensions
                  selectedWidth={this.state.selectedWidth}
                  selectedHeight={this.state.selectedHeight}
                />
              </span>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color={this.state.cropButtonColor}
              onClick={() => this.handleSave()}
              className={this.state.cropButtonClass}
            >
              Crop Image
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
          <AspectRatio>
            <AspectRatioButton
              onClick={e => this.setAspectRatio(16 / 9, true)}
              dataTip="Set the aspect ratio to 16 by 9"
            >
              16:9
            </AspectRatioButton>
            <AspectRatioButton
              onClick={e => this.setAspectRatio(4 / 3, true)}
              dataTip="Set the aspect ratio to 4 by 3"
            >
              4:3
            </AspectRatioButton>
            <AspectRatioButton
              onClick={e => this.setAspectRatio(1 / 1, true)}
              dataTip="Set the aspect ratio to 1 by 1"
            >
              1:1
            </AspectRatioButton>
            <AspectRatioButton
              onClick={e => this.setAspectRatio(2 / 3, true)}
              dataTip="Set the aspect ratio to 2 by 3"
            >
              2:3
            </AspectRatioButton>
            <AspectRatioButton
              onClick={e => this.setAspectRatio(NaN, true)}
              dataTip="Set the aspect ratio to free mode"
            >
              Free
            </AspectRatioButton>
            <AspectRatioButton>
              <Input
                type="text"
                value={this.state.customAspectRatio}
                onChange={this.handleAspectChange}
                placeholder="Example: 16:9"
              />
              <Button
                color="primary"
                onClick={() => this.setCustomAspectRatio()}
              >
                Set Custom Aspect Ratio
              </Button>
            </AspectRatioButton>
          </AspectRatio>
          <SavecroppedTool onClick={() => this.toggleModal()}></SavecroppedTool>
        </div>
        <div class="img-container">
          <img
            class="imagecrop-field-selection"
            src={this.props.data.image}
            ref="image"
          ></img>
        </div>
        <Dimensions
          selectedWidth={this.state.selectedWidth}
          selectedHeight={this.state.selectedHeight}
        />
      </div>
    );
  }
}

export default ImageCropField;
