<?php

namespace WebbuildersGroup\ImageCropField\Forms;

use SilverStripe\Assets\Image;
use SilverStripe\Forms\FormField;
use SilverStripe\ORM\DataObject;

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

    protected $schemaDataType = FormField::SCHEMA_DATA_TYPE_CUSTOM;

    protected $schemaComponent = 'ImageCropField';

    /**
     * @param DataObject $data The parent dataobject
     * @param string $title The title of the field
     * @param Image the image we will be manipulating
     */
    public function __construct($data, $title, $image)
    {
        //used for saving back to the parent object and referencing db fields
        $this->data = [
            'data' => $data,
            'title' => $title,
            'image' => $image,
        ];

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
     * All cropping to be done on this image
     *
     * @return void
     */
    public function setEnabledCrop()
    {
        $this->enable_crop = true;
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

    public function getSchemaStateDefaults()
    {
        $state = parent::getSchemaStateDefaults();

        //check to see if there is an image and set the data
        if ($this->data["image"]) {
            //the image
            $image = $this->data["image"]->ScaleWidth(500);
            $state['data'] += [
                'image' => $image->URL,
            ];
        }
        return $state;
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
