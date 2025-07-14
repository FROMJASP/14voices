import { getPayload } from 'payload';
import configPromise from '@payload-config';

async function setupDefaultBlocks() {
  const payload = await getPayload({ config: configPromise });

  try {
    console.log('Setting up default blocks...');

    // Check if we already have navbar/footer blocks
    const existingBlocks = await payload.find({
      collection: 'blocks',
      where: {
        or: [{ blockType: { equals: 'navbar' } }, { blockType: { equals: 'footer' } }],
      },
    });

    if (existingBlocks.docs.length > 0) {
      console.log('Default blocks already exist. Skipping creation.');
      return;
    }

    // Create default navbar block
    const navbarBlock = await payload.create({
      collection: 'blocks',
      data: {
        name: 'Main Navigation',
        blockType: 'navbar',
        navbar: {
          logo: {
            type: 'text',
            text: '14 Voices',
          },
          mainMenu: [
            {
              type: 'link',
              label: 'Home',
              link: {
                type: 'internal',
                url: '/',
              },
            },
            {
              type: 'link',
              label: 'Voice Overs',
              link: {
                type: 'internal',
                url: '/voiceovers',
              },
            },
            {
              type: 'link',
              label: 'About',
              link: {
                type: 'internal',
                url: '/about',
              },
            },
            {
              type: 'link',
              label: 'Contact',
              link: {
                type: 'internal',
                url: '/contact',
              },
            },
          ],
          mobileSettings: {
            breakpoint: 768,
            menuStyle: 'slide',
            showLogo: true,
          },
          style: {
            backgroundColor: '#ffffff',
            textColor: '#000000',
            height: '80px',
            position: 'fixed',
            blur: true,
            shadow: true,
          },
        },
        visibility: {
          desktop: true,
          tablet: true,
          mobile: true,
        },
      },
    });

    console.log(`Created navbar block: ${navbarBlock.id}`);

    // Create default footer block
    const footerBlock = await payload.create({
      collection: 'blocks',
      data: {
        name: 'Main Footer',
        blockType: 'footer',
        footer: {
          columns: [
            {
              title: 'Company',
              links: [
                {
                  label: 'About Us',
                  link: {
                    type: 'internal',
                    url: '/about',
                  },
                },
                {
                  label: 'Our Team',
                  link: {
                    type: 'internal',
                    url: '/team',
                  },
                },
                {
                  label: 'Careers',
                  link: {
                    type: 'internal',
                    url: '/careers',
                  },
                },
              ],
            },
            {
              title: 'Services',
              links: [
                {
                  label: 'Voice Overs',
                  link: {
                    type: 'internal',
                    url: '/voiceovers',
                  },
                },
                {
                  label: 'Audio Production',
                  link: {
                    type: 'internal',
                    url: '/audio-production',
                  },
                },
                {
                  label: 'Script Writing',
                  link: {
                    type: 'internal',
                    url: '/script-writing',
                  },
                },
              ],
            },
            {
              title: 'Support',
              links: [
                {
                  label: 'Contact',
                  link: {
                    type: 'internal',
                    url: '/contact',
                  },
                },
                {
                  label: 'FAQ',
                  link: {
                    type: 'internal',
                    url: '/faq',
                  },
                },
                {
                  label: 'Privacy Policy',
                  link: {
                    type: 'internal',
                    url: '/privacy',
                  },
                },
              ],
            },
          ],
          bottomBar: {
            copyright: '© 2024 14 Voices. All rights reserved.',
            socialLinks: [
              {
                platform: 'twitter',
                url: 'https://twitter.com/14voices',
              },
              {
                platform: 'linkedin',
                url: 'https://linkedin.com/company/14voices',
              },
            ],
          },
          mobileSettings: {
            columnLayout: 'stacked',
            hideColumns: [],
          },
          style: {
            backgroundColor: '#111111',
            textColor: '#ffffff',
            linkColor: '#999999',
            linkHoverColor: '#ffffff',
          },
        },
        visibility: {
          desktop: true,
          tablet: true,
          mobile: true,
        },
      },
    });

    console.log(`Created footer block: ${footerBlock.id}`);

    // Create default banner block (disabled by default)
    const bannerBlock = await payload.create({
      collection: 'blocks',
      data: {
        name: 'Announcement Banner',
        blockType: 'banner',
        banner: {
          enabled: false,
          text: 'Welcome to our new website! 🎉',
          link: {
            enabled: false,
            label: 'Learn More',
            url: '/announcement',
          },
          dismissible: true,
          style: 'gradient',
        },
        visibility: {
          desktop: true,
          tablet: true,
          mobile: true,
        },
      },
    });

    console.log(`Created banner block: ${bannerBlock.id}`);

    // Create default layout with these blocks
    const defaultLayout = await payload.create({
      collection: 'layouts',
      data: {
        name: 'Default Layout',
        description: 'Main layout for the website',
        blocks: [navbarBlock.id, bannerBlock.id, footerBlock.id],
        isDefault: true,
        settings: {
          containerWidth: 'standard',
          spacing: {
            contentPadding: 'medium',
          },
        },
      },
    });

    console.log(`\nCreated default layout: ${defaultLayout.id}`);
    console.log('\nDefault blocks setup completed successfully!');
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

setupDefaultBlocks();
