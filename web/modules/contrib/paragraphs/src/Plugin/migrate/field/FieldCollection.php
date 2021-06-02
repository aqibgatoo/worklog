<?php

namespace Drupal\paragraphs\Plugin\migrate\field;

use Drupal\migrate\Plugin\MigrationInterface;
use Drupal\migrate_drupal\Plugin\migrate\field\FieldPluginBase;
use Drupal\paragraphs\ParagraphsMigration;

/**
 * Field Plugin for field collection migrations.
 *
 * @todo Implement ::defineValueProcessPipeline()
 * @see https://www.drupal.org/project/paragraphs/issues/2911244
 *
 * @MigrateField(
 *   id = "field_collection",
 *   core = {7},
 *   type_map = {
 *     "field_collection" = "entity_reference_revisions",
 *   },
 *   source_module = "field_collection",
 *   destination_module = "paragraphs",
 * )
 */
class FieldCollection extends FieldPluginBase {

  /*
   * Length of the 'field_' prefix that field collection prepends to bundles.
   */
  const FIELD_COLLECTION_PREFIX_LENGTH = 6;

  /**
   * {@inheritdoc}
   */
  public function defineValueProcessPipeline(MigrationInterface $migration, $field_name, $data) {
    $process = [
      'plugin' => 'sub_process',
      'source' => $field_name,
      'process' => [
        'target_id' => [
          [
            'plugin' => 'paragraphs_lookup',
            'tags' => 'Field Collection Content',
            'source' => 'value',
          ],
          [
            'plugin' => 'extract',
            'index' => ['id'],
          ],
        ],
        'target_revision_id' => [
          [
            'plugin' => 'paragraphs_lookup',
            'tags' => [
              'Field Collection Revisions Content',
              'Field Collection Content',
            ],
            'tag_ids' => [
              'Field Collection Revisions Content' => ['revision_id'],
              'Field Collection Content' => ['value'],
            ],
          ],
          [
            'plugin' => 'extract',
            'index' => ['revision_id'],
          ],
        ],
      ],
    ];
    $migration->setProcessOfProperty($field_name, $process);

    // Add the respective field collection migration as a dependency.
    $dependencies = $migration->getMigrationDependencies() + ['required' => []];
    $derivation_method_by_parent = ParagraphsMigration::getParagraphsMigrationDerivationMethod() === ParagraphsMigration::DERIVATION_METHOD_PARENT;
    $required_migration_suffix = $field_name;
    $destination_plugin_id = $migration->getDestinationPlugin()->getPluginId();
    $destination_config = $migration->getDestinationPlugin()->configuration;
    $is_revision_migration = strpos($destination_plugin_id, 'entity_revision:') === 0 || strpos($destination_plugin_id, 'entity_complete:') === 0 || (strpos($destination_plugin_id, 'entity_reference_revisions:') === 0 && !empty($destination_config['new_revisions']));

    if ($derivation_method_by_parent) {
      $destination_entity_type_id = strpos($destination_plugin_id, 'entity:') === 0 || strpos($destination_plugin_id, 'entity_revision:') === 0 || strpos($destination_plugin_id, 'entity_complete:') === 0 || strpos($destination_plugin_id, 'entity_reference_revisions:') === 0 ?
        explode(':', $destination_plugin_id)[1] :
        NULL;
      $destination_entity_bundle_id = $destination_entity_type_id && !empty($destination_config['default_bundle']) ?
        $destination_config['default_bundle'] :
        NULL;

      if ($destination_entity_type_id) {
        $required_migration_suffix .= ":$destination_entity_type_id";
      }
      if ($destination_entity_bundle_id) {
        $required_migration_suffix .= ":$destination_entity_bundle_id";
      }

      $required_migrations = ["d7_field_collection:$required_migration_suffix"];
      if ($is_revision_migration) {
        $required_migrations[] = "d7_field_collection_revisions:$required_migration_suffix";
      }
    }
    else {
      $required_migrations = ["d7_field_collection:$required_migration_suffix"];
      if ($is_revision_migration) {
        $required_migrations[] = "d7_field_collection_revisions:$required_migration_suffix";
      }
    }
    $dependencies['required'] = array_unique(array_merge(array_values($dependencies['required']), $required_migrations));
    $migration->set('migration_dependencies', $dependencies);
  }

  /**
   * {@inheritdoc}
   */
  public function alterFieldFormatterMigration(MigrationInterface $migration) {
    $this->addViewModeProcess($migration);
    parent::alterFieldFormatterMigration($migration);
  }

  /**
   * {@inheritdoc}
   */
  public function getFieldFormatterMap() {
    return [
      'field_collection_view' => 'entity_reference_revisions_entity_view',
    ] + parent::getFieldFormatterMap();
  }

  /**
   * {@inheritdoc}
   */
  public function getFieldWidgetMap() {
    return ['field_collection_embed' => 'entity_reference_paragraphs']
      + parent::getFieldWidgetMap();
  }

  /**
   * {@inheritdoc}
   */
  public function alterFieldMigration(MigrationInterface $migration) {
    $settings = [
      'field_collection' => [
        'plugin' => 'field_collection_field_settings',
      ],
    ];
    $migration->mergeProcessOfProperty('settings', $settings);
  }

  /**
   * {@inheritdoc}
   */
  public function alterFieldInstanceMigration(MigrationInterface $migration) {
    $settings = [
      'field_collection' => [
        'plugin' => 'field_collection_field_instance_settings',
      ],
    ];
    $migration->mergeProcessOfProperty('settings', $settings);
  }

  /**
   * Adds process for view mode settings.
   *
   * @param \Drupal\migrate\Plugin\MigrationInterface $migration
   *   The migration.
   */
  protected function addViewModeProcess(MigrationInterface $migration) {
    $view_mode = [
      'field_collection' => [
        'plugin' => 'paragraphs_process_on_value',
        'source_value' => 'type',
        'expected_value' => 'field_collection',
        'process' => [
          'plugin' => 'get',
          'source' => 'formatter/settings/view_mode',
        ],
      ],
    ];
    $migration->mergeProcessOfProperty('options/settings/view_mode', $view_mode);
  }

}
