/* global document */
import React from "react";
import Injector from "lib/Injector";
import ImageCropField from "../components/ImageCropField.jsx";

//register components
document.addEventListener("DOMContentLoaded", () => {
  Injector.component.register("ImageCropField", ImageCropField);
});
