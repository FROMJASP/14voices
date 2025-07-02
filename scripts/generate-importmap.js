#!/usr/bin/env node

/**
 * This script generates a minimal importMap.js file for Vercel builds
 * when database is not available during build time
 */

const fs = require('fs')
const path = require('path')

const importMapPath = path.join(__dirname, '../src/app/(payload)/admin/importMap.js')

const importMapContent = `import { NameCell as NameCell_9c0639e919331889896aa9ea1c557661 } from '../../../components/admin/cells/NameCell'
import { ProfilePhotoCell as ProfilePhotoCell_fc0d7ba41e7df02cabb84445148888d0 } from '../../../components/admin/cells/ProfilePhotoCell'
import { StyleTagsCell as StyleTagsCell_789abce5a437648d513c3e44bd81ed9c } from '../../../components/admin/cells/StyleTagsCell'
import { AudioDemoCell as AudioDemoCell_c5277311b993037e42bbdbf8c691c657 } from '../../../components/admin/cells/AudioDemoCell'
import { StatusCell as StatusCell_9552c302193d4c39b8e8f39758f33f86 } from '../../../components/admin/cells/StatusCell'
import { GroupCell as GroupCell_4f97fbdb7152b6433c40f3aaa21af63b } from '../../../components/admin/cells/GroupCell'
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
import { VercelBlobClientUploadHandler as VercelBlobClientUploadHandler_16c82c5e25f430251a3e3ba57219ff4e } from '@payloadcms/storage-vercel-blob/client'

export const importMap = {
  "./components/admin/cells/NameCell#NameCell": NameCell_9c0639e919331889896aa9ea1c557661,
  "./components/admin/cells/ProfilePhotoCell#ProfilePhotoCell": ProfilePhotoCell_fc0d7ba41e7df02cabb84445148888d0,
  "./components/admin/cells/StyleTagsCell#StyleTagsCell": StyleTagsCell_789abce5a437648d513c3e44bd81ed9c,
  "./components/admin/cells/AudioDemoCell#AudioDemoCell": AudioDemoCell_c5277311b993037e42bbdbf8c691c657,
  "./components/admin/cells/StatusCell#StatusCell": StatusCell_9552c302193d4c39b8e8f39758f33f86,
  "./components/admin/cells/GroupCell#GroupCell": GroupCell_4f97fbdb7152b6433c40f3aaa21af63b,
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
  "@payloadcms/storage-vercel-blob/client#VercelBlobClientUploadHandler": VercelBlobClientUploadHandler_16c82c5e25f430251a3e3ba57219ff4e
}
`

// Create directory if it doesn't exist
const dir = path.dirname(importMapPath)
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}

// Write the importMap file
fs.writeFileSync(importMapPath, importMapContent)
console.log('✅ Generated importMap.js for build')