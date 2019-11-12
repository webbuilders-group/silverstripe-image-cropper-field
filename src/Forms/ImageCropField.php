<?php

namespace WebbuildersGroup\ImageCropField\Forms;

use SilverStripe\Assets\Image;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\FormField;
use SilverStripe\Forms\HiddenField;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\DataObjectInterface;

/**
 * An Image Selection Field that allows the user to select a section of the image
 * this also will save the crop box data so on refresh the selection remains.
 *
 * This field also has the option to create a cropped image and save it to the
 * files system (work in progress).
 *
 */
class ImageCropField extends FormField
{

    private static $allowed_actions = [
        'cropImage',
    ];

    protected $enable_crop = false;

    protected $data = [];

    protected $imageDataField;

    /**
     * @param DataObject $data The parent dataobject
     * @param string $title The title of the field
     * @param string $imageData the form field to save the data too
     * @param Image the image we will be manipulating
     */
    public function __construct($data, $title, $imageData, $image)
    {
        //used for saving back to the parent object and referencing db fields
        $this->data = [
            'data' => $data,
            'title' => $title,
            'imageData' => $imageData,
            'image' => $image,
        ];

        // Set up fieldnames
        $this->setupChildren();

        parent::__construct($this->getName(), $title);
    }

    // Auto generate a name
    public function getName()
    {
        return sprintf(
            '%s',
            $this->data["title"]
        );
    }

    /**
     * Set up child hidden fields
     * @return FieldList the children
     */
    public function setupChildren()
    {
        $name = $this->getName();

        // Create the latitude/longitude hidden fields
        $this->imageDataField = HiddenField::create(
            $name . '[imageData]',
            'imageData',
            $this->data["data"]->{$this->data["imageData"]}
        );

        $this->children = new FieldList(
            $this->imageDataField
        );

        return $this->children;
    }

    /**
     * {@inheritdoc}
     */
    public function setValue($record, $data = null)
    {
        $this->imageDataField->setValue(
            $record["imageData"]
        );

        return $this;
    }

    /**
     * All cropping to be done on this image
     *
     * @return void
     */
    public function setEnabledCrop()
    {
        $this->enable_crop = true;
    }

    /**
     * Take the fields and saves them to the DataObject.
     * {@inheritdoc}
     */
    public function saveInto(DataObjectInterface $record)
    {
        $record->setCastedField($this->data["imageData"], $this->imageDataField->dataValue());

        return $this;
    }

    /**
     * @return FieldList
     */
    public function getChildFields()
    {
        return $this->children;
    }

    /**
     * returns the Image
     *
     * @return {Image}
     */
    public function getImage()
    {
        return $this->data["image"];
    }

    /**
     * get if the crop button should be active on this field
     *
     * @return {boolean} true if enabled false if disabled
     */
    public function getEnableCrop()
    {
        return $this->enable_crop;
    }

    /**
     * Crop the image using the data saved on the parent dataobject
     *
     * @return void
     */
    public function cropImage()
    {
        //if cropping has not been turned on redirect back
        if (!$this->getEnableCrop()) {
            $this->getForm()->sessionMessage('Cropping is disabled for this field', 'bad');
            return $this->redirectBack();
        }

        //var_dump($this->getForm()->sessionMessage('test'));exit;
        //var_dump($this->data["data"]->{$this->data["imageData"]});exit;
        $this->getForm()->sessionMessage('Not implimented yet. Should lean on php for cropping.', 'warning');

        return $this->redirectBack();
    }
}
