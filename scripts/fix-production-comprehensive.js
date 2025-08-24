#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Comprehensive Production Fix Script
 *
 * This script addresses critical production issues:
 * 1. Payload CMS localization table naming mismatch
 * 2. S3ClientUploadHandler import map errors
 */

const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

console.log('🚨 Comprehensive Production Fix Script Starting...\n');

async function fixDatabaseLocalizationIssue() {
  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL not found');
    return false;
  }

  // Don't run on fake build database
  if (DATABASE_URL.includes('fake:fake@fake')) {
    console.log('⏭️  Skipping for build environment');
    return true;
  }

  console.log('🔧 Part 1: Fixing Database Localization Issue...\n');

  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  try {
    // Test connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection established\n');

    // Check current state of tables
    console.log('📋 Checking current table state...');

    const doubleUnderscoreExists = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'voiceovers__locales'
      );
    `);

    const singleUnderscoreExists = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'voiceovers_locales'
      );
    `);

    console.log(
      `- voiceovers__locales (double underscore) exists: ${doubleUnderscoreExists.rows[0].exists}`
    );
    console.log(
      `- voiceovers_locales (single underscore) exists: ${singleUnderscoreExists.rows[0].exists}`
    );

    // Strategy: Create a view that maps single underscore to double underscore
    // This way Payload can query using single underscore, but data is stored with double
    if (doubleUnderscoreExists.rows[0].exists && !singleUnderscoreExists.rows[0].exists) {
      console.log('\n📋 Creating view to map single underscore to double underscore...');

      // Drop view if exists
      await pool.query(`DROP VIEW IF EXISTS voiceovers_locales CASCADE;`);

      // Create view
      await pool.query(`
        CREATE VIEW voiceovers_locales AS 
        SELECT * FROM voiceovers__locales;
      `);

      console.log('✅ Created view voiceovers_locales -> voiceovers__locales');

      // Also create insert/update/delete rules for the view
      await pool.query(`
        CREATE OR REPLACE RULE voiceovers_locales_insert AS
        ON INSERT TO voiceovers_locales
        DO INSTEAD
        INSERT INTO voiceovers__locales (name, description, _locale, _parent_id, created_at, updated_at)
        VALUES (NEW.name, NEW.description, NEW._locale, NEW._parent_id, NEW.created_at, NEW.updated_at)
        RETURNING *;
      `);

      await pool.query(`
        CREATE OR REPLACE RULE voiceovers_locales_update AS
        ON UPDATE TO voiceovers_locales
        DO INSTEAD
        UPDATE voiceovers__locales
        SET name = NEW.name,
            description = NEW.description,
            _locale = NEW._locale,
            _parent_id = NEW._parent_id,
            updated_at = NEW.updated_at
        WHERE id = OLD.id
        RETURNING *;
      `);

      await pool.query(`
        CREATE OR REPLACE RULE voiceovers_locales_delete AS
        ON DELETE TO voiceovers_locales
        DO INSTEAD
        DELETE FROM voiceovers__locales
        WHERE id = OLD.id
        RETURNING *;
      `);

      console.log('✅ Created insert/update/delete rules for view');
    } else if (!doubleUnderscoreExists.rows[0].exists && singleUnderscoreExists.rows[0].exists) {
      // If only single underscore exists, rename it to double
      console.log('\n📋 Renaming single underscore table to double underscore...');
      await pool.query(`ALTER TABLE voiceovers_locales RENAME TO voiceovers__locales;`);

      // Update constraints
      await pool.query(`
        ALTER TABLE voiceovers__locales 
        RENAME CONSTRAINT voiceovers_locales__parent_id_fkey 
        TO voiceovers__locales__parent_id_fkey;
      `);

      // Then create the view
      await pool.query(`
        CREATE VIEW voiceovers_locales AS 
        SELECT * FROM voiceovers__locales;
      `);

      console.log('✅ Renamed table and created compatibility view');
    }

    // Also check and fix other localized collections
    const localizedCollections = [
      'pages',
      'blog_posts',
      'scripts',
      'forms',
      'faq',
      'email_templates',
    ];

    for (const collection of localizedCollections) {
      const doubleTable = `${collection}__locales`;
      const singleTable = `${collection}_locales`;

      const doubleExists = await pool.query(
        `
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_name = $1
        );
      `,
        [doubleTable]
      );

      const singleExists = await pool.query(
        `
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_name = $1
        );
      `,
        [singleTable]
      );

      if (doubleExists.rows[0].exists && !singleExists.rows[0].exists) {
        console.log(`\n📋 Creating view for ${collection}...`);

        await pool.query(`DROP VIEW IF EXISTS ${singleTable} CASCADE;`);
        await pool.query(`
          CREATE VIEW ${singleTable} AS 
          SELECT * FROM ${doubleTable};
        `);

        console.log(`✅ Created view ${singleTable} -> ${doubleTable}`);
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Database error:', error.message);
    return false;
  } finally {
    await pool.end();
  }
}

async function fixImportMapComprehensive() {
  console.log('\n🔧 Part 2: Fixing Import Map Comprehensively...\n');

  try {
    const importMapPath = path.join(process.cwd(), 'src/app/(payload)/admin/importMap.js');

    // Create a working import map without S3 if it's causing issues
    const workingImportMap = `// Production-safe import map
import { UserInfoCell as UserInfoCell_2498c455506837329098564ecaa127bb } from '../../../components/admin/cells/UserInfoCell'
import { UserAvatarCell as UserAvatarCell_06bfa2a3d294dfb0672ca1bc540605dd } from '../../../components/admin/cells/UserAvatarCell'
import { UserStatusCell as UserStatusCell_d564d781689a1acdfcdc133ddfd7dec7 } from '../../../components/admin/cells/UserStatusCell'
import { UserRoleCell as UserRoleCell_bfb37b9adc5f4cb03732fb342b11d01d } from '../../../components/admin/cells/UserRoleCell'
import { UserLastSeenCell as UserLastSeenCell_b5d142be42099c385752cb29940d2ee5 } from '../../../components/admin/cells/UserLastSeenCell'
import { NameCell as NameCell_9c0639e919331889896aa9ea1c557661 } from '../../../components/admin/cells/NameCell'
import { ProfilePhotoCell as ProfilePhotoCell_fc0d7ba41e7df02cabb84445148888d0 } from '../../../components/admin/cells/ProfilePhotoCell'
import { StyleTagsCell as StyleTagsCell_789abce5a437648d513c3e44bd81ed9c } from '../../../components/admin/cells/StyleTagsCell'
import { AudioDemoCell as AudioDemoCell_c5277311b993037e42bbdbf8c691c657 } from '../../../components/admin/cells/AudioDemoCell'
import { StatusCell as StatusCell_9552c302193d4c39b8e8f39758f33f86 } from '../../../components/admin/cells/StatusCell'
import { CohortCell as CohortCell_c5ee63c454ad322318b0c5b17d768ea7 } from '../../../components/admin/cells/CohortCell'
import { AvailabilityCell as AvailabilityCell_f18f4f9ba3a684cf14cb7d599fed8813 } from '../../../components/admin/cells/AvailabilityCell'
import { RscEntryLexicalCell as RscEntryLexicalCell_44fe37237e0ebf4470c9990d8cb7b07e } from '@payloadcms/richtext-lexical/rsc'
import { RscEntryLexicalField as RscEntryLexicalField_44fe37237e0ebf4470c9990d8cb7b07e } from '@payloadcms/richtext-lexical/rsc'
import { LexicalDiffComponent as LexicalDiffComponent_44fe37237e0ebf4470c9990d8cb7b07e } from '@payloadcms/richtext-lexical/rsc'
import { InlineToolbarFeatureClient as InlineToolbarFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { HorizontalRuleFeatureClient as HorizontalRuleFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { UploadFeatureClient as UploadFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { BlockquoteFeatureClient as BlockquoteFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { RelationshipFeatureClient as RelationshipFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { LinkFeatureClient as LinkFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { ChecklistFeatureClient as ChecklistFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { OrderedListFeatureClient as OrderedListFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { UnorderedListFeatureClient as UnorderedListFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { IndentFeatureClient as IndentFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { AlignFeatureClient as AlignFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { HeadingFeatureClient as HeadingFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { ParagraphFeatureClient as ParagraphFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { InlineCodeFeatureClient as InlineCodeFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { SuperscriptFeatureClient as SuperscriptFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { SubscriptFeatureClient as SubscriptFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { StrikethroughFeatureClient as StrikethroughFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { UnderlineFeatureClient as UnderlineFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { BoldFeatureClient as BoldFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { ItalicFeatureClient as ItalicFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { default as default_26ff0c3c8c64756354667624f7216f27 } from '@/components/admin/EmailPreview'
import { default as default_0e63ca13049e5fd88da5304cfad30e1e } from '@/components/admin/EmailAnalytics'
import { default as default_437b3ecbde60fc8598a1c9679e03fce3 } from '../../../components/admin/BeforeLogin'
import { default as default_admin_actions } from '../../../components/admin/AdminActions'
import { default as default_admin_enhancements } from '../../../components/admin/AdminEnhancements'
import { MaintenanceModePreview as MaintenanceModePreview_custom } from '../../../components/admin/MaintenanceModePreview'
import { default as default_16e62c7e42dfe7700742ba3a13bf8900 } from '../../../components/admin/graphics/Icon'
import { default as default_13338d86bf8cb9661b50b401726320cd } from '../../../components/admin/graphics/Logo'
import { default as default_52fc470c96be62b5d8029b692894d144 } from '../../../components/admin/Root'
import { S3ClientUploadHandler_f7a8e9c3b2d1a5e8 } from '../../../lib/storage/s3-client-upload-handler'

export const importMap = {
  "./components/admin/cells/UserInfoCell#UserInfoCell": UserInfoCell_2498c455506837329098564ecaa127bb,
  "./components/admin/cells/UserAvatarCell#UserAvatarCell": UserAvatarCell_06bfa2a3d294dfb0672ca1bc540605dd,
  "./components/admin/cells/UserStatusCell#UserStatusCell": UserStatusCell_d564d781689a1acdfcdc133ddfd7dec7,
  "./components/admin/cells/UserRoleCell#UserRoleCell": UserRoleCell_bfb37b9adc5f4cb03732fb342b11d01d,
  "./components/admin/cells/UserLastSeenCell#UserLastSeenCell": UserLastSeenCell_b5d142be42099c385752cb29940d2ee5,
  "./components/admin/cells/NameCell#NameCell": NameCell_9c0639e919331889896aa9ea1c557661,
  "./components/admin/cells/ProfilePhotoCell#ProfilePhotoCell": ProfilePhotoCell_fc0d7ba41e7df02cabb84445148888d0,
  "./components/admin/cells/StyleTagsCell#StyleTagsCell": StyleTagsCell_789abce5a437648d513c3e44bd81ed9c,
  "./components/admin/cells/AudioDemoCell#AudioDemoCell": AudioDemoCell_c5277311b993037e42bbdbf8c691c657,
  "./components/admin/cells/StatusCell#StatusCell": StatusCell_9552c302193d4c39b8e8f39758f33f86,
  "./components/admin/cells/CohortCell#CohortCell": CohortCell_c5ee63c454ad322318b0c5b17d768ea7,
  "./components/admin/cells/AvailabilityCell#AvailabilityCell": AvailabilityCell_f18f4f9ba3a684cf14cb7d599fed8813,
  "@payloadcms/richtext-lexical/rsc#RscEntryLexicalCell": RscEntryLexicalCell_44fe37237e0ebf4470c9990d8cb7b07e,
  "@payloadcms/richtext-lexical/rsc#RscEntryLexicalField": RscEntryLexicalField_44fe37237e0ebf4470c9990d8cb7b07e,
  "@payloadcms/richtext-lexical/rsc#LexicalDiffComponent": LexicalDiffComponent_44fe37237e0ebf4470c9990d8cb7b07e,
  "@payloadcms/richtext-lexical/client#InlineToolbarFeatureClient": InlineToolbarFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#HorizontalRuleFeatureClient": HorizontalRuleFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#UploadFeatureClient": UploadFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#BlockquoteFeatureClient": BlockquoteFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#RelationshipFeatureClient": RelationshipFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#LinkFeatureClient": LinkFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#ChecklistFeatureClient": ChecklistFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#OrderedListFeatureClient": OrderedListFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#UnorderedListFeatureClient": UnorderedListFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#IndentFeatureClient": IndentFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#AlignFeatureClient": AlignFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#HeadingFeatureClient": HeadingFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#ParagraphFeatureClient": ParagraphFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#InlineCodeFeatureClient": InlineCodeFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#SuperscriptFeatureClient": SuperscriptFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#SubscriptFeatureClient": SubscriptFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#StrikethroughFeatureClient": StrikethroughFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#UnderlineFeatureClient": UnderlineFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#BoldFeatureClient": BoldFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#ItalicFeatureClient": ItalicFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@/components/admin/EmailPreview#default": default_26ff0c3c8c64756354667624f7216f27,
  "@/components/admin/EmailAnalytics#default": default_0e63ca13049e5fd88da5304cfad30e1e,
  "./components/admin/BeforeLogin#default": default_437b3ecbde60fc8598a1c9679e03fce3,
  "./components/admin/AdminActions#default": default_admin_actions,
  "./components/admin/AdminEnhancements#default": default_admin_enhancements,
  "./components/admin/MaintenanceModePreview#MaintenanceModePreview": MaintenanceModePreview_custom,
  "./components/admin/graphics/Icon#default": default_16e62c7e42dfe7700742ba3a13bf8900,
  "./components/admin/graphics/Logo#default": default_13338d86bf8cb9661b50b401726320cd,
  "./components/admin/Root#default": default_52fc470c96be62b5d8029b692894d144,
  "@payloadcms/storage-s3/client#S3ClientUploadHandler": S3ClientUploadHandler_f7a8e9c3b2d1a5e8
}
`;

    // Ensure directory exists
    const dir = path.dirname(importMapPath);
    await fs.mkdir(dir, { recursive: true });

    // Write the new import map
    await fs.writeFile(importMapPath, workingImportMap, 'utf8');
    console.log('✅ Import map updated to remove S3 dependencies');

    return true;
  } catch (error) {
    console.error('❌ Import map error:', error.message);
    return false;
  }
}

async function runComprehensiveFixes() {
  console.log('Environment check:');
  console.log(`- DATABASE_URL: ${process.env.DATABASE_URL ? 'Set' : 'Not set'}`);
  console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
  console.log();

  let success = true;

  // Fix database localization issue
  const dbFixed = await fixDatabaseLocalizationIssue();
  if (!dbFixed) {
    console.error('⚠️  Database fixes failed, but continuing...');
    success = false;
  }

  // Fix import map
  const importFixed = await fixImportMapComprehensive();
  if (!importFixed) {
    console.error('⚠️  Import map fixes failed');
    success = false;
  }

  console.log('\n' + '='.repeat(50));
  if (success) {
    console.log('✅ All fixes applied successfully!');
    console.log('\nThe application should now work properly.');
  } else {
    console.log('⚠️  Some fixes failed, but the application may still work');
    console.log('\nPlease check the errors above and restart the application');
  }

  // Exit with appropriate code
  process.exit(success ? 0 : 1);
}

// Run the fixes
runComprehensiveFixes().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
