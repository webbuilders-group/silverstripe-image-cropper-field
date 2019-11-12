<?php
namespace WebbuildersGroup\ImageCropField\Extensions;

use SilverStripe\Core\Extension;
use SilverStripe\Forms\FieldList;
use WebbuildersGroup\ImageCropField\Forms\ImageCropField;

class ImageCropFieldAssetFormFactoryExtension extends Extension
{

    public function updateFormFields(FieldList $fields, $controller, $formName, $context)
    {
        $image = isset($context['Record']) ? $context['Record'] : null;
        if ($image && $image->appCategory() === 'image') {
            $fields->insertAfter(
                'Title',
                ImageCropField::create($this->owner, 'crop', 'test', $image)
            );
        }
    }
}
