<?php

namespace Drupal\paragraphs\Plugin\migrate\field;

use Drupal\migrate\Plugin\MigrationInterface;
use Drupal\migrate_drupal\Plugin\migrate\field\FieldPluginBase;
use Drupal\paragraphs\ParagraphsMigration;

/**
 * Field Plugin for paragraphs migrations.
 *
 * @todo Implement ::defineValueProcessPipeline()
 * @see https://www.drupal.org/project/paragraphs/issues/2911244
 *
 * @MigrateField(
 *   id = "paragraphs",
 *   core = {7},
 *   type_map = {
 *     "paragraphs" = "entity_reference_revisions",
 *   },
 *   source_module = "paragraphs",
 *   destination_module = "paragraphs",
 * )
 */
class Paragraphs extends FieldPluginBase {

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
            'tags' => 'Paragraphs Content',
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
              'Paragraphs Revisions Content',
              'Paragraphs Content',
            ],
            'tag_ids' => [
              'Paragraphs Revisions Content' => ['revision_id'],
              'Paragraphs Content' => ['value'],
            ],
            // D8.4 Does not like an empty source value, Even when using ids.
            'source' => 'value',
          ],
          [
            'plugin' => 'extract',
            'index' => ['revision_id'],
          ],
        ],
      ],
    ];
    $migration->setProcessOfProperty($field_name, $process);

    // Add paragraphs migration as a dependency (if this is not a paragraph
    // migration).
    $dependencies = $migration->getMigrationDependencies() + ['required' => []];
    $derivation_method_by_parent = ParagraphsMigration::getParagraphsMigrationDerivationMethod() === ParagraphsMigration::DERIVATION_METHOD_PARENT;
    if ($derivation_method_by_parent) {
      $required_migration_suffix = $field_name;
      $destination_plugin_id = $migration->getDestinationPlugin()->getPluginId();
      $destination_config = $migration->getDestinationPlugin()->configuration;
      $is_revision_migration = strpos($destination_plugin_id, 'entity_revision:') === 0 || strpos($destination_plugin_id, 'entity_complete:') === 0 || (strpos($destination_plugin_id, 'entity_reference_revisions:') === 0 && !empty($destination_config['new_revisions']));
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

      $required_migrations = ["d7_paragraphs:$required_migration_suffix"];
      if ($is_revision_migration) {
        $required_migrations[] = "d7_paragraphs_revisions:$required_migration_suffix";
      }

      $dependencies['required'] = array_unique(array_merge(array_values($dependencies['required']), $required_migrations));
    }
    // When paragraph migrations are derived only based on their own bundle, we
    // cannot guarantee that the nested paragraphs will be already migrated.
    elseif (!in_array('Paragraphs Content', $migration->getMigrationTags(), TRUE)) {
      $dependencies['required'] = array_unique(array_merge(array_values($dependencies['required']), ['d7_paragraphs']));

      if (strpos($migration->getDestinationPlugin()->getPluginId(), 'entity_revision:') === 0 || strpos($migration->getDestinationPlugin()->getPluginId(), 'entity_complete:') === 0) {
        $dependencies['required'] = array_unique(array_merge(array_values($dependencies['required']), [
          'd7_paragraphs_revisions',
        ]));
      }
    }

    $migration->set('migration_dependencies', $dependencies);
  }

  /**
   * {@inheritdoc}
   */
  public function alterFieldWidgetMigration(MigrationInterface $migration) {
    parent::alterFieldWidgetMigration($migration);
    $this->paragraphAlterFieldWidgetMigration($migration);
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
      'paragraphs_view' => 'entity_reference_revisions_entity_view',
    ] + parent::getFieldFormatterMap();
  }

  /**
   * {@inheritdoc}
   */
  public function getFieldWidgetMap() {
    return [
      'paragraphs_embed' => 'entity_reference_paragraphs',
    ] + parent::getFieldWidgetMap();
  }

  /**
   * {@inheritdoc}
   */
  public function alterFieldMigration(MigrationInterface $migration) {
    $settings = [
      'paragraphs' => [
        'plugin' => 'paragraphs_field_settings',
      ],
    ];
    $migration->mergeProcessOfProperty('settings', $settings);
  }

  /**
   * {@inheritdoc}
   */
  public function alterFieldInstanceMigration(MigrationInterface $migration) {
    $settings = [
      'paragraphs' => [
        'plugin' => 'paragraphs_field_instance_settings',
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
      'paragraphs' => [
        'plugin' => 'paragraphs_process_on_value',
        'source_value' => 'type',
        'expected_value' => 'paragraphs',
        'process' => [
          'plugin' => 'get',
          'source' => 'formatter/settings/view_mode',
        ],
      ],
    ];
    $migration->mergeProcessOfProperty('options/settings/view_mode', $view_mode);
  }

  /**
   * Adds processes for paragraphs field widgets.
   *
   * @param \Drupal\migrate\Plugin\MigrationInterface $migration
   *   The migration.
   */
  protected function paragraphAlterFieldWidgetMigration(MigrationInterface $migration) {
    $title = [
      'paragraphs' => [
        'plugin' => 'paragraphs_process_on_value',
        'source_value' => 'type',
        'expected_value' => 'paragraphs',
        'process' => [
          'plugin' => 'get',
          'source' => 'settings/title',
        ],
      ],
    ];
    $title_plural = [
      'paragraphs' => [
        'plugin' => 'paragraphs_process_on_value',
        'source_value' => 'type',
        'expected_value' => 'paragraphs',
        'process' => [
          'plugin' => 'get',
          'source' => 'settings/title_multiple',
        ],
      ],
    ];
    $edit_mode = [
      'paragraphs' => [
        'plugin' => 'paragraphs_process_on_value',
        'source_value' => 'type',
        'expected_value' => 'paragraphs',
        'process' => [
          'plugin' => 'get',
          'source' => 'settings/default_edit_mode',
        ],
      ],
    ];
    $add_mode = [
      'paragraphs' => [
        'plugin' => 'paragraphs_process_on_value',
        'source_value' => 'type',
        'expected_value' => 'paragraphs',
        'process' => [
          'plugin' => 'get',
          'source' => 'settings/add_mode',
        ],
      ],
    ];

    $migration->mergeProcessOfProperty('options/settings/title', $title);
    $migration->mergeProcessOfProperty('options/settings/title_plural', $title_plural);
    $migration->mergeProcessOfProperty('options/settings/edit_mode', $edit_mode);
    $migration->mergeProcessOfProperty('options/settings/add_mode', $add_mode);
  }

}
