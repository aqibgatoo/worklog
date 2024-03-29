<?php

namespace Drupal\Tests\paragraphs\Kernel\migrate;

use Drupal\Core\TypedData\TranslatableInterface;
use Drupal\node\Entity\Node;
use Drupal\Tests\paragraphs\Traits\ParagraphsNodeMigrationAssertionsTrait;

/**
 * Test 'classic' Paragraph content migration.
 *
 * @group paragraphs
 * @require entity_reference_revisions
 */
class ParagraphContentMigrationTest extends ParagraphsMigrationTestBase {

  use ParagraphsNodeMigrationAssertionsTrait;

  /**
   * {@inheritdoc}
   */
  public static $modules = [
    'comment',
    'datetime',
    'datetime_range',
    'field',
    'file',
    'image',
    'link',
    'menu_ui',
    'node',
    'options',
    'system',
    'taxonomy',
    'telephone',
    'text',
    'user',
    'content_translation',
    'language',
    'migrate_drupal_multilingual',
  ];

  /**
   * {@inheritdoc}
   */
  public function setUp() {
    parent::setUp();

    $this->installEntitySchema('file');
    $this->installEntitySchema('node');
    $this->installEntitySchema('paragraph');
    $this->installEntitySchema('comment');
    $this->installSchema('node', ['node_access']);
    $this->installSchema('comment', [
      'comment_entity_statistics',
    ]);
  }

  /**
   * Tests the migration of a content with paragraphs and field collections.
   *
   * @dataProvider providerParagraphContentMigration
   */
  public function testParagraphContentMigration($migration_to_run, bool $derive_by_parent) {
    if ($migration_to_run) {
      // Drupal 8.8.x only has 'classic' node migrations.
      // @see https://www.drupal.org/node/3105503
      if (strpos($migration_to_run, 'd7_node_complete') === 0 && version_compare(\Drupal::VERSION, '8.9', '<')) {
        $this->pass("Drupal 8.8.x has only the 'classic' node migration.");
        return;
      }
    }

    $this->setParagraphsMigrationDerivedByParent($derive_by_parent);

    $this->executeMigrationWithDependencies('d7_field_collection_revisions');
    $this->executeMigrationWithDependencies('d7_paragraphs_revisions');
    $this->executeMigrationWithDependencies('d7_node:paragraphs_test');

    $this->prepareMigrations([
      'd7_node:article' => [],
      'd7_node:blog' => [],
      'd7_node:book' => [],
      'd7_node:forum' => [],
      'd7_node:test_content_type' => [],
    ]);

    if ($migration_to_run) {
      $this->executeMigration($migration_to_run);
    }

    $this->assertNode8Paragraphs();

    $this->assertNode9Paragraphs();

    $node_9 = Node::load(9);
    if ($node_9 instanceof TranslatableInterface && !empty($node_9->getTranslationLanguages(FALSE))) {
      $this->assertIcelandicNode9Paragraphs();
    }
  }

  /**
   * Provides data and expected results for testing paragraph migrations.
   *
   * @return string[][]
   *   The node migration to run.
   */
  public function providerParagraphContentMigration() {
    return [
      [
        'node_migration' => NULL,
        'derive_by_parent' => FALSE,
      ],
      [
        'node_migration' => 'd7_node_revision:paragraphs_test',
        'derive_by_parent' => FALSE,
      ],
      [
        'node_migration' => 'd7_node_translation:paragraphs_test',
        'derive_by_parent' => FALSE,
      ],
      [
        'node_migration' => 'd7_node_complete:paragraphs_test',
        'derive_by_parent' => FALSE,
      ],
      [
        'node_migration' => NULL,
        'derive_by_parent' => TRUE,
      ],
      [
        'node_migration' => 'd7_node_revision:paragraphs_test',
        'derive_by_parent' => TRUE,
      ],
      [
        'node_migration' => 'd7_node_translation:paragraphs_test',
        'derive_by_parent' => TRUE,
      ],
      [
        'node_migration' => 'd7_node_complete:paragraphs_test',
        'derive_by_parent' => TRUE,
      ],
    ];
  }

}
