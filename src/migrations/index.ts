import * as migration_20241230_update_voiceovers_schema from './20241230_update_voiceovers_schema';
import * as migration_20250101_add_performance_indexes from './20250101_add_performance_indexes';
import * as migration_20250804_212943_upgrade_to_stable from './20250804_212943_upgrade_to_stable';

export const migrations = [
  {
    up: migration_20241230_update_voiceovers_schema.up,
    down: migration_20241230_update_voiceovers_schema.down,
    name: '20241230_update_voiceovers_schema',
  },
  {
    up: migration_20250101_add_performance_indexes.up,
    down: migration_20250101_add_performance_indexes.down,
    name: '20250101_add_performance_indexes',
  },
  {
    up: migration_20250804_212943_upgrade_to_stable.up,
    down: migration_20250804_212943_upgrade_to_stable.down,
    name: '20250804_212943_upgrade_to_stable',
  },
];
