<?php

namespace Drupal\paragraphs\Plugin\migrate\source\d7;

/**
 * Field Collection Item Revision source plugin.
 *
 * Available configuration keys:
 * - field_name: (optional) If supplied, this will only return field collections
 *   of that particular type.
 *
 * @MigrateSource(
 *   id = "d7_field_collection_item_revision",
 *   source_module = "field_collection",
 * )
 */
class FieldCollectionItemRevision extends FieldCollectionItem {

  /**
   * Join string for getting all except the current revisions.
   */
  const JOIN = "f.item_id = fr.item_id AND f.revision_id <> fr.revision_id";

  /**
   * The prefix of the field table that contains the entity properties.
   *
   * @var string
   */
  const PARENT_FIELD_TABLE_PREFIX = 'field_revision_';

  /**
   * The prefix of the field table that contains the entity properties.
   *
   * @var string
   */
  const PARENT_FIELD_TABLE_PREFIX = 'field_revision_';

  /**
   * {@inheritdoc}
   */
  public function getIds() {
    return [
      'revision_id' => [
        'type' => 'integer',
        'alias' => 'fr',
      ],
    ];
  }

}
