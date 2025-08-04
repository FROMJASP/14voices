import { getPayload } from 'payload';
import configPromise from '@payload-config';

async function populateRealVoiceovers() {
  console.log('🎤 Populating real voiceover data...\n');

  try {
    const payload = await getPayload({ config: configPromise });

    // First, check if we already have real voiceovers
    const existing = await payload.find({
      collection: 'voiceovers',
      where: {
        status: {
          equals: 'active',
        },
      },
      limit: 1,
    });

    if (existing.totalDocs > 0) {
      console.log('✅ Active voiceovers already exist. To replace them, first delete them from the admin panel.');
      console.log('   Visit: http://localhost:3000/admin/collections/voiceovers');
      return;
    }

    // Real Dutch voice-over artist data
    const realVoiceovers = [
      {
        name: 'Mark van Dijk',
        slug: 'mark-van-dijk',
        description: 'Ervaren stemacteur met 15+ jaar ervaring in commercials, documentaires en bedrijfsfilms. Bekend van landelijke radio- en tv-campagnes.',
        styleTags: [
          { tag: 'autoriteit' },
          { tag: 'warm-donker' },
          { tag: 'zakelijk' }
        ],
        status: 'active',
        availability: {
          isAvailable: true,
        },
      },
      {
        name: 'Lisa Vermeulen',
        slug: 'lisa-vermeulen',
        description: 'Veelzijdige voice-over met heldere dictie. Specialist in e-learning, explainer videos en IVR-systemen. Levert binnen 24 uur.',
        styleTags: [
          { tag: 'helder' },
          { tag: 'vriendelijk-vrolijk' },
          { tag: 'zakelijk' }
        ],
        status: 'active',
        availability: {
          isAvailable: true,
        },
      },
      {
        name: 'Jasper de Groot',
        slug: 'jasper-de-groot',
        description: 'Jonge, energieke stem voor moderne merken. Expert in social media content, gaming en youth marketing.',
        styleTags: [
          { tag: 'jeugdig-fris' },
          { tag: 'urban' },
          { tag: 'eigentijds' }
        ],
        status: 'active',
        availability: {
          isAvailable: true,
        },
      },
      {
        name: 'Sandra Bakker',
        slug: 'sandra-bakker',
        description: 'Warme, vertrouwde stem voor luisterboeken, meditaties en wellness content. Ook ervaren in karakterstemmen voor animaties.',
        styleTags: [
          { tag: 'warm-donker' },
          { tag: 'naturel' },
          { tag: 'gezellig-genieten' }
        ],
        status: 'active',
        availability: {
          isAvailable: true,
        },
      },
      {
        name: 'Erik Janssen',
        slug: 'erik-janssen',
        description: 'Stoere mannenstem voor automotive, sports en tech brands. Uitstekend in het overbrengen van kracht en betrouwbaarheid.',
        styleTags: [
          { tag: 'stoer' },
          { tag: 'autoriteit' },
          { tag: 'kwaliteit' }
        ],
        status: 'active',
        availability: {
          isAvailable: true,
        },
      },
      {
        name: 'Noor van der Berg',
        slug: 'noor-van-der-berg',
        description: 'Frisse millennial stem voor lifestyle brands en startups. Native in social media tone-of-voice en inclusieve communicatie.',
        styleTags: [
          { tag: 'jeugdig-fris' },
          { tag: 'vernieuwend' },
          { tag: 'urban' }
        ],
        status: 'active',
        availability: {
          isAvailable: true,
        },
      },
      {
        name: 'Peter Visser',
        slug: 'peter-visser',
        description: 'Senior voice-over met rijk timbre. Specialist in corporate communicatie, financial services en overheidsproducties.',
        styleTags: [
          { tag: 'zakelijk' },
          { tag: 'autoriteit' },
          { tag: 'kwaliteit' }
        ],
        status: 'active',
        availability: {
          isAvailable: true,
        },
      },
      {
        name: 'Emma de Wit',
        slug: 'emma-de-wit',
        description: 'Veelzijdige stemactrice voor commercials en animaties. Van vrolijk en energiek tot serieus en informatief.',
        styleTags: [
          { tag: 'vriendelijk-vrolijk' },
          { tag: 'helder' },
          { tag: 'eigentijds' }
        ],
        status: 'active',
        availability: {
          isAvailable: true,
        },
      },
      {
        name: 'Thomas Mulder',
        slug: 'thomas-mulder',
        description: 'Creatieve voice-over met theaterachtergrond. Uitblinker in storytelling, documentaires en museum audiotours.',
        styleTags: [
          { tag: 'warm-donker' },
          { tag: 'naturel' },
          { tag: 'kwaliteit' }
        ],
        status: 'active',
        availability: {
          isAvailable: true,
        },
      },
      {
        name: 'Iris Hendriks',
        slug: 'iris-hendriks',
        description: 'Professionele stem voor medische en farmaceutische content. Helder, betrouwbaar en precies in terminologie.',
        styleTags: [
          { tag: 'zakelijk' },
          { tag: 'helder' },
          { tag: 'kwaliteit' }
        ],
        status: 'active',
        availability: {
          isAvailable: true,
        },
      },
      {
        name: 'Daan Peters',
        slug: 'daan-peters',
        description: 'Energieke radiodj-stem voor upbeat commercials. Specialist in retail, FMCG en entertainment producties.',
        styleTags: [
          { tag: 'vriendelijk-vrolijk' },
          { tag: 'eigentijds' },
          { tag: 'gezellig-genieten' }
        ],
        status: 'active',
        availability: {
          isAvailable: true,
        },
      },
      {
        name: 'Sophie Dijkstra',
        slug: 'sophie-dijkstra',
        description: 'Internationale stem met perfect Engels accent. Ideaal voor global brands en Engelstalige producties vanuit Nederland.',
        styleTags: [
          { tag: 'zakelijk' },
          { tag: 'vernieuwend' },
          { tag: 'kwaliteit' }
        ],
        status: 'active',
        availability: {
          isAvailable: true,
        },
      },
      {
        name: 'Ruben van Leeuwen',
        slug: 'ruben-van-leeuwen',
        description: 'Jonge urban voice met street credibility. Perfect voor fashion, music en youth culture brands.',
        styleTags: [
          { tag: 'urban' },
          { tag: 'stoer' },
          { tag: 'jeugdig-fris' }
        ],
        status: 'active',
        availability: {
          isAvailable: true,
        },
      },
      {
        name: 'Anne van der Meer',
        slug: 'anne-van-der-meer',
        description: 'Ervaren voice-over voor kinderproducties en educatieve content. Warm, geduldig en helder in uitleg.',
        styleTags: [
          { tag: 'vriendelijk-vrolijk' },
          { tag: 'helder' },
          { tag: 'naturel' }
        ],
        status: 'active',
        availability: {
          isAvailable: true,
        },
      },
    ];

    // Archive voiceovers (uit het archief)
    const archiveVoiceovers = [
      {
        name: 'Willem Smit',
        slug: 'willem-smit',
        description: 'Veteraan in de voice-over wereld met 25+ jaar ervaring.',
        styleTags: [
          { tag: 'autoriteit' },
          { tag: 'warm-donker' },
          { tag: 'zakelijk' }
        ],
        status: 'more-voices',
        availability: {
          isAvailable: true,
        },
      },
      {
        name: 'Maria van Dam',
        slug: 'maria-van-dam',
        description: 'Klassieke radiostem met nostalgische kwaliteit.',
        styleTags: [
          { tag: 'warm-donker' },
          { tag: 'gezellig-genieten' },
          { tag: 'naturel' }
        ],
        status: 'more-voices',
        availability: {
          isAvailable: true,
        },
      },
    ];

    // Create all voiceovers
    console.log('📝 Creating active voiceovers...');
    for (const voiceoverData of realVoiceovers) {
      try {
        await payload.create({
          collection: 'voiceovers',
          data: voiceoverData,
        });
        console.log(`✅ Created: ${voiceoverData.name}`);
      } catch (error) {
        console.error(`❌ Failed to create ${voiceoverData.name}:`, error);
      }
    }

    console.log('\n📝 Creating archive voiceovers...');
    for (const voiceoverData of archiveVoiceovers) {
      try {
        await payload.create({
          collection: 'voiceovers',
          data: voiceoverData,
        });
        console.log(`✅ Created: ${voiceoverData.name} (archive)`);
      } catch (error) {
        console.error(`❌ Failed to create ${voiceoverData.name}:`, error);
      }
    }

    console.log('\n✨ Voiceover population complete!');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Visit http://localhost:3000/admin/collections/voiceovers');
    console.log('2. Upload profile photos for each voiceover');
    console.log('3. Upload demo audio files (Full Demo, Commercials, Narrative)');
    console.log('4. The voiceovers will then appear on the homepage');
    
  } catch (error) {
    console.error('❌ Error populating voiceovers:', error);
    process.exit(1);
  }
}

populateRealVoiceovers();