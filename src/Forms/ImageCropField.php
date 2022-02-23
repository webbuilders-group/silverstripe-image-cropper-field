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
        // used for saving back to the parent object and referencing db fields
        $this->data = [
            'data' => $data,
            'title' => $title,
            'image' => $image,
        ];

        parent::__construct($this->getName(), $title);
    }

    //  Auto generate a name
    public function getName()
    {
        return sprintf(
            '%s',
            $this->data['title']
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
        return $this->data['image'];
    }

    public function getSchemaStateDefaults()
    {
        $state = parent::getSchemaStateDefaults();

        // check to see if there is an image and set the data
        if ($this->data['image']) {
            // the image
            $image = $this->data['image'];
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
        // clean the strings
        $newTitle = ltrim(str_replace(['.', '\\'], ['', '/'], $name), '/');

        // find the folder of the current image
        $image = $this->data['image'];
        $parent = $image->Parent()->getFilename();
        $folder = strpos($parent, 'Cropped') !== false
            ? $parent
            : $parent . 'Cropped/';

        // create an image object
        $finalImage = Image::create();

        //  file hash must be uniq
        $hash = md5(time());
        $finalImage->setFromString($imageData, $folder . $newTitle . '.jpg', $hash);

        // remove folder names frome title
        $tokens = explode('/', $newTitle);
        $newTitle = trim(end($tokens));
        // set the title
        $finalImage->Title = $newTitle;
        $finalImage->write();

        // regenerate thumbnails and publish it
        $finalImage->publishSingle();
        AssetAdmin::create()->generateThumbnails($finalImage);

        return $finalImage;
    }

    /**
     * Crop the image using the data saved on the parent dataobject
     *
     * @return void
     */
    public function cropImage()
    {
        if (!Director::is_ajax()) {
            // return as this shouldn't be hit otherwise
            return $this->redirectBack();
        }

        // get the image
        $data = $this->request->postVars();

        if (!array_key_exists('image', $data)) {
            return json_encode([
                'status' => 'error',
                'link' => '' . null,
            ]);
        }

        //  clean the image string
        list($meta, $content) = explode(',', $data['image']);

        //  the actual image
        $fileData = base64_decode($content);

        // create the image in SilverStripe
        $finalImage = $this->createImage($fileData, $data['name']);
        $editLink = $finalImage->CMSEditLink();

        return json_encode([
            'id' => $finalImage->ID,
            'status' => 'complete',
            'link' => '' . $editLink,
            'thumbnail' => $finalImage->PreviewLink(),
        ]);
    }
}
