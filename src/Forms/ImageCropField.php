<?php

namespace WebbuildersGroup\ImageCropField\Forms;

use SilverStripe\AssetAdmin\Controller\AssetAdmin;
use SilverStripe\Assets\Image;
use SilverStripe\Control\Director;
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
            $image = $this->data["image"];
            $state['data'] += [
                'image' => $image->URL,
                'name' => $this->getName(),
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
     * Will attepmt to create the image in ss, regenerate thumbnails, and publish it.
     *
     * @param [image stream] $imageData
     * @return void
     */
    public function createImage($imageData, $name)
    {
        //the new tilte/filename
        $newTitle = $name;

        //clean the strings
        $newTitle = str_replace('.', '', $newTitle);
        $newTitle = str_replace('\\', '/', $newTitle);

        //remove a slash from the start
        $newTitle = ltrim($newTitle, '/');

        //find the folder of the current image
        $image = $this->data["image"];
        $folder = $image->Parent()->getFilename() . "Cropped/";

        //create an image object
        $finalImage = Image::create();
        //use the record id and time to make the file name unique as the resampled images don't work otherwise
        $finalImage->setFromString($imageData, $folder . $newTitle . ".jpg");
        //remove folder names frome title
        $tokens = explode('/', $newTitle);
        $newTitle = trim(end($tokens));
        //set the title
        $finalImage->Title = $newTitle;
        $finalImage->write();

        //regenerate thumbnails and publish it
        AssetAdmin::create()->generateThumbnails($finalImage);
        $finalImage->publishSingle();

        return $finalImage->CMSEditLink();
    }

    /**
     * Crop the image using the data saved on the parent dataobject
     *
     * @return void
     */
    public function cropImage()
    {
        if (Director::is_ajax()) {

            //get the image
            $data = $this->request->postVars();

            if (in_array("image", $data)) {
                //clean the image string
                $img = str_replace(' ', '+', str_replace('data:image/png;base64,', '', $data['image']));
                //the actual image
                $fileData = base64_decode($img);

                //create the image in SilverStripe
                $editLink = $this->createImage($fileData, $data['name']);

                $return = [
                    'status' => 'complete',
                    'link' => "" . $editLink,
                ];
            } else {
                $return = [
                    'status' => 'error',
                    'link' => "" . null,
                ];
            }

            //send back json
            return json_encode($return);
        } else {
            //return as this shouldn't be hit otherwise
            return $this->redirectBack();
        }
    }
}
