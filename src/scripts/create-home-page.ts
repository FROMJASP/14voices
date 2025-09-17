import { getPayload } from 'payload';
import configPromise from '@payload-config';

async function createHomePage() {
  const payload = await getPayload({ config: configPromise });

  try {
    // Check if home page already exists
    const existingPages = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'home',
        },
      },
    });

    if (existingPages.docs.length > 0) {
      console.log('Home page already exists, updating it...');

      // Update the existing home page
      const homePage = existingPages.docs[0];
      await payload.update({
        collection: 'pages',
        id: homePage.id,
        data: {
          title: 'Home',
          slug: 'home',
          status: 'published',
          // @ts-expect-error - Hero field removed, use layout blocks instead
          hero: {
            type: 'homepage',
            processSteps: [
              { text: 'Kies de stem' },
              { text: 'Upload script' },
              { text: 'Ontvang audio' },
            ],
            title: 'Vind de stem die jouw merk laat spreken.',
            description:
              'Een goed verhaal verdient een goede stem. Daarom trainde wij onze 14 voice-overs die samen met onze technici klaarstaan om jouw tekst tot leven te brengen!',
            primaryButton: {
              text: 'Ontdek stemmen',
              url: '#voiceovers',
            },
            secondaryButton: {
              text: 'Hoe wij werken',
              url: '/hoe-het-werkt',
            },
            // heroImage: null, // Leave empty for now - admin can upload via CMS
            stats: [
              { number: '14', label: 'Stemacteurs' },
              { number: '<48u', label: 'Snelle levering' },
              { number: '9.1/10', label: 'Klantbeoordeling' },
            ],
          },
          content: {
            root: {
              type: 'root',
              format: '',
              indent: 0,
              version: 1,
              children: [
                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: 'Welcome to 14voices - Your professional voice-over partner.',
                      type: 'text',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  type: 'paragraph',
                  version: 1,
                },
              ],
              direction: 'ltr',
            },
          },
          showInNav: true,
          navOrder: 0,
        },
      });

      console.log('Home page updated successfully!');
    } else {
      console.log('Creating new home page...');

      // Create new home page
      await payload.create({
        collection: 'pages',
        data: {
          title: 'Home',
          slug: 'home',
          status: 'published',
          // @ts-expect-error - Hero field removed, use layout blocks instead
          hero: {
            type: 'homepage',
            processSteps: [
              { text: 'Kies de stem' },
              { text: 'Upload script' },
              { text: 'Ontvang audio' },
            ],
            title: 'Vind de stem die jouw merk laat spreken.',
            description:
              'Een goed verhaal verdient een goede stem. Daarom trainde wij onze 14 voice-overs die samen met onze technici klaarstaan om jouw tekst tot leven te brengen!',
            primaryButton: {
              text: 'Ontdek stemmen',
              url: '#voiceovers',
            },
            secondaryButton: {
              text: 'Hoe wij werken',
              url: '/hoe-het-werkt',
            },
            // heroImage: null, // Leave empty for now - admin can upload via CMS
            stats: [
              { number: '14', label: 'Stemacteurs' },
              { number: '<48u', label: 'Snelle levering' },
              { number: '9.1/10', label: 'Klantbeoordeling' },
            ],
          },
          content: {
            root: {
              type: 'root',
              format: '',
              indent: 0,
              version: 1,
              children: [
                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: 'Welcome to 14voices - Your professional voice-over partner.',
                      type: 'text',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  type: 'paragraph',
                  version: 1,
                },
              ],
              direction: 'ltr',
            },
          },
          showInNav: true,
          navOrder: 0,
        },
      });

      console.log('Home page created successfully!');
    }
  } catch (error) {
    console.error('Error creating/updating home page:', error);
  }

  process.exit(0);
}

createHomePage();
