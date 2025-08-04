import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise });
    
    // Get all voiceovers without any filters first
    const allVoiceovers = await payload.find({
      collection: 'voiceovers',
      limit: 100,
      depth: 1,
    });
    
    // Get active voiceovers with deeper depth to fetch relations
    const activeVoiceovers = await payload.find({
      collection: 'voiceovers',
      where: {
        status: {
          equals: 'active',
        },
      },
      limit: 100,
      depth: 2, // Increase depth to fetch media relations
    });
    
    // Get some sample data for debugging
    const sampleVoiceover = allVoiceovers.docs[0];
    
    // Check if the demos are actually populated
    const sampleWithDetails = sampleVoiceover ? {
      id: sampleVoiceover.id,
      name: sampleVoiceover.name,
      status: sampleVoiceover.status,
      slug: sampleVoiceover.slug,
      fullDemoReel: sampleVoiceover.fullDemoReel ? {
        type: typeof sampleVoiceover.fullDemoReel,
        hasUrl: !!(typeof sampleVoiceover.fullDemoReel === 'object' && sampleVoiceover.fullDemoReel?.url),
        url: typeof sampleVoiceover.fullDemoReel === 'object' ? sampleVoiceover.fullDemoReel?.url : null,
        filename: typeof sampleVoiceover.fullDemoReel === 'object' ? sampleVoiceover.fullDemoReel?.filename : null,
      } : null,
      commercialsDemo: sampleVoiceover.commercialsDemo ? {
        type: typeof sampleVoiceover.commercialsDemo,
        hasUrl: !!(typeof sampleVoiceover.commercialsDemo === 'object' && sampleVoiceover.commercialsDemo?.url),
        url: typeof sampleVoiceover.commercialsDemo === 'object' ? sampleVoiceover.commercialsDemo?.url : null,
      } : null,
      narrativeDemo: sampleVoiceover.narrativeDemo ? {
        type: typeof sampleVoiceover.narrativeDemo,
        hasUrl: !!(typeof sampleVoiceover.narrativeDemo === 'object' && sampleVoiceover.narrativeDemo?.url),
        url: typeof sampleVoiceover.narrativeDemo === 'object' ? sampleVoiceover.narrativeDemo?.url : null,
      } : null,
      availability: sampleVoiceover.availability,
      styleTags: sampleVoiceover.styleTags,
    } : null;
    
    return NextResponse.json({
      total: allVoiceovers.totalDocs,
      activeCount: activeVoiceovers.totalDocs,
      statuses: allVoiceovers.docs.map(v => ({
        id: v.id,
        name: v.name,
        status: v.status,
        slug: v.slug,
        hasFullDemoReel: !!v.fullDemoReel,
        hasCommercialsDemo: !!v.commercialsDemo,
        hasNarrativeDemo: !!v.narrativeDemo,
      })),
      sampleVoiceover: sampleWithDetails,
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch voiceovers',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}