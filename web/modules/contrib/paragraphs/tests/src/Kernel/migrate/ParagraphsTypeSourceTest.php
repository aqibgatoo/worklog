<?php

namespace Drupal\Tests\paragraphs\Kernel\migrate;

use Drupal\Tests\migrate\Kernel\MigrateSqlSourceTestBase;
use Drupal\Tests\paragraphs\Traits\ParagraphsSourceData;

/**
 * Test the paragraphs_type source plugin.
 *
 * @covers \Drupal\paragraphs\Plugin\migrate\source\d7\ParagraphsType
 * @group paragraphs
 */
class ParagraphsTypeSourceTest extends MigrateSqlSourceTestBase {

  use ParagraphsSourceData;

  /**
   * {@inheritdoc}
   */
  public static $modules = ['migrate_drupal', 'paragraphs'];

  /**
   * {@inheritdoc}
   */
  public function providerSource() {
    return [
      [
        'source_data' => $this->getSourceData(),
        'expected_results' => [
          [
            'bundle' => 'paragraphs_bundle',
            'name' => 'Paragraphs Bundle',
            'locked' => '1',
            'description' => '',
          ],
        ],
      ],
    ];
  }

}
