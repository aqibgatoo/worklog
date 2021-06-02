<?php

namespace Drupal\paragraphs\Plugin\migrate;

use Drupal\Component\Plugin\Derivative\DeriverBase;
use Drupal\Core\Database\DatabaseExceptionWrapper;
use Drupal\Core\Plugin\Discovery\ContainerDeriverInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\migrate\Exception\RequirementsException;
use Drupal\migrate\Plugin\MigrationDeriverTrait;
use Drupal\migrate_drupal\FieldDiscoveryInterface;
use Drupal\migrate_drupal\Plugin\migrate\source\DrupalSqlBase;
use Drupal\paragraphs\ParagraphsMigration;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Deriver for Paragraph Items.
 */
class D7ParagraphsItemDeriver extends DeriverBase implements ContainerDeriverInterface {

  use MigrationDeriverTrait;
  use StringTranslationTrait;

  /**
   * The base plugin ID this derivative is for.
   *
   * @var string
   */
  protected $basePluginId;

  /**
   * The migration field discovery service.
   *
   * @var \Drupal\migrate_drupal\FieldDiscoveryInterface
   */
  protected $fieldDiscovery;

  /**
   * D7ParagraphsItemDeriver constructor.
   *
   * @param string $base_plugin_id
   *   The base plugin ID for the plugin ID.
   * @param \Drupal\migrate_drupal\FieldDiscoveryInterface $field_discovery
   *   The migration field discovery service.
   */
  public function __construct($base_plugin_id, FieldDiscoveryInterface $field_discovery) {
    $this->basePluginId = $base_plugin_id;
    $this->fieldDiscovery = $field_discovery;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, $base_plugin_id) {
    return new static(
      $base_plugin_id,
      $container->get('migrate_drupal.field_discovery')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getDerivativeDefinitions($base_plugin_definition) {
    $derivation_method_by_parent = ParagraphsMigration::getParagraphsMigrationDerivationMethod() === ParagraphsMigration::DERIVATION_METHOD_PARENT;
    $types = static::getSourcePlugin('d7_paragraphs_type');

    try {
      $types->checkRequirements();

      $paragraph_types = [];
      foreach ($types as $type) {
        $paragraph_types[$type->getSourceProperty('bundle')] = [
          'paragraph_bundle' => $type->getSourceProperty('bundle'),
          'paragraph_name' => $type->getSourceProperty('name'),
        ];
      }
    }
    catch (RequirementsException $e) {
      return $this->derivatives;
    }

    if ($derivation_method_by_parent) {
      try {
        assert($types instanceof DrupalSqlBase);
        $query = $types->getDatabase()->select('field_config_instance', 'fci')
          ->fields('fci', ['entity_type', 'bundle', 'field_name', 'data'])
          ->condition('fc.type', 'paragraphs')
          ->condition('fc.module', 'paragraphs')
          ->condition('fc.active', 1)
          ->condition('fc.storage_active', 1)
          ->condition('fc.deleted', 0)
          ->condition('fci.deleted', 0);
        $query->join('field_config', 'fc', 'fc.id = fci.field_id');
        $statement = $query->execute();
        if (!$statement) {
          // No paragraph fields found in this source database.
          return $this->derivatives;
        }
        $paragraph_derivatives = array_reduce($statement->fetchAll(), function (array $carry, $row) {
          $fci_data = unserialize($row->data);
          $carry[$row->entity_type][$row->bundle][$row->field_name] = $fci_data['label'];
          return $carry;
        }, []);
      }
      catch (DatabaseExceptionWrapper $e) {
        // Once we begin iterating the source plugin it is possible that the
        // source tables will not exist. This can happen when the
        // MigrationPluginManager gathers up the migration definitions but we do
        // not actually have a Drupal 7 source database.
        return $this->derivatives;
      }
    }
    else {
      // Let's use 'dummy' entity_type, bundle and field_name keys.
      $paragraph_derivatives = [[['No field label']]];
    }

    // Parent entity type: 'node', 'paragraph', etc.
    foreach ($paragraph_derivatives as $parent_entity_type => $parent_bundle_data) {
      // Parent entity bundle: 'article', 'tags', 'paragraph_bundle_one', etc.
      foreach ($parent_bundle_data as $parent_bundle => $field_names) {
        // Field names, e.g. 'paragraph_one_only'.
        foreach ($field_names as $field_name => $field_label) {
          // Paragraph bundles.
          foreach ($paragraph_types as $paragraph_type_data) {
            $values = $base_plugin_definition;
            [
              'paragraph_bundle' => $paragraph_bundle,
              'paragraph_name' => $paragraph_name,
            ] = $paragraph_type_data;
            $derivative_id = $derivation_method_by_parent ?
              "$field_name:$parent_entity_type:$parent_bundle:$paragraph_bundle" :
              $paragraph_bundle;
            $label_args = [
              '@label' => $values['label'],
              '@type' => $paragraph_name,
            ];
            if ($derivation_method_by_parent) {
              $label_args += [
                '@parent_entity_bundle' => $parent_bundle,
                '@parent_entity_type' => $parent_entity_type,
                '@field_label' => $field_label,
              ];
            }
            $values['label'] = $derivation_method_by_parent ?
              $this->t('@label of type @type (in @parent_entity_bundle @parent_entity_type, referenced from @field_label field)', $label_args) :
              $this->t('@label (@type)', $label_args);
            $values['source']['bundle'] = $paragraph_bundle;
            $values['destination']['default_bundle'] = $paragraph_bundle;

            if ($derivation_method_by_parent) {
              $values['source']['parent_type'] = $parent_entity_type;
              $values['source']['parent_bundle'] = $parent_bundle;
              $values['source']['field_name'] = $field_name;
            }

            /** @var \Drupal\migrate\Plugin\Migration $migration */
            $migration = \Drupal::service('plugin.manager.migration')
              ->createStubMigration($values);
            $this->fieldDiscovery->addBundleFieldProcesses($migration, 'paragraphs_item', $paragraph_bundle);
            $this->derivatives[$derivative_id] = $migration->getPluginDefinition();
          }
        }
      }
    }
    return $this->derivatives;
  }

}
