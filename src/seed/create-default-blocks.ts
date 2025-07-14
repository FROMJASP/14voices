import { getPayload } from 'payload';
import configPromise from '@payload-config';

async function createDefaultBlocks() {
  const payload = await getPayload({ config: configPromise });

  try {
    console.log('Creating default blocks for 14voices...');

    // Check if blocks already exist
    const existingBlocks = await payload.find({
      collection: 'blocks',
      limit: 100,
    });

    if (existingBlocks.docs.length > 0) {
      console.log('Blocks already exist. Skipping creation.');

      // Create or update homepage layout
      const layouts = await payload.find({
        collection: 'layouts',
        where: {
          name: {
            equals: 'Homepage Layout',
          },
        },
      });

      if (layouts.docs.length === 0) {
        // Get all block IDs in order: navbar, hero, footer
        const navbarBlock = existingBlocks.docs.find((b) => b.blockType === 'navbar');
        const heroBlock = existingBlocks.docs.find((b) => b.blockType === 'heroBanner');
        const footerBlock = existingBlocks.docs.find((b) => b.blockType === 'footer');
        const bannerBlock = existingBlocks.docs.find((b) => b.blockType === 'banner');

        const blockIds = [];
        if (navbarBlock) blockIds.push(navbarBlock.id);
        if (bannerBlock) blockIds.push(bannerBlock.id);
        if (heroBlock) blockIds.push(heroBlock.id);
        if (footerBlock) blockIds.push(footerBlock.id);

        await payload.create({
          collection: 'layouts',
          data: {
            name: 'Homepage Layout',
            description: 'Default layout for the homepage',
            blocks: blockIds,
            isDefault: true,
            settings: {
              containerWidth: 'standard',
              spacing: {
                contentPadding: 'medium',
              },
            },
          },
        });

        console.log(`Created homepage layout with ${blockIds.length} blocks`);
      }

      return;
    }

    // Create navbar block
    const navbarBlock = await payload.create({
      collection: 'blocks',
      data: {
        name: 'Main Navbar',
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
              label: 'Voice Samples',
              link: {
                type: 'internal',
                url: '/voice-samples',
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

    console.log('Created navbar block');

    // Create hero block
    const heroBlock = await payload.create({
      collection: 'blocks',
      data: {
        name: 'Homepage Hero',
        blockType: 'heroBanner',
        heroBanner: {
          headline: 'Professional Voice Overs in 14 Languages',
          subheadline: 'High-quality voice recordings for your projects, delivered fast',
          ctaButtons: [
            {
              text: 'Browse Voices',
              link: '/voice-samples',
              style: 'primary',
            },
            {
              text: 'Get Quote',
              link: '/contact',
              style: 'secondary',
            },
          ],
          backgroundType: 'gradient',
          height: 'large',
          alignment: 'center',
        },
        visibility: {
          desktop: true,
          tablet: true,
          mobile: true,
        },
      },
    });

    console.log('Created hero block');

    // Create footer block
    const footerBlock = await payload.create({
      collection: 'blocks',
      data: {
        name: 'Main Footer',
        blockType: 'footer',
        footer: {
          columns: [
            {
              title: 'Services',
              links: [
                {
                  label: 'Voice Overs',
                  link: {
                    type: 'internal',
                    url: '/voice-samples',
                  },
                },
                {
                  label: 'Audio Production',
                  link: {
                    type: 'internal',
                    url: '/services/audio-production',
                  },
                },
                {
                  label: 'Script Translation',
                  link: {
                    type: 'internal',
                    url: '/services/translation',
                  },
                },
              ],
            },
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
                  label: 'Our Process',
                  link: {
                    type: 'internal',
                    url: '/process',
                  },
                },
                {
                  label: 'Testimonials',
                  link: {
                    type: 'internal',
                    url: '/testimonials',
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
                  label: 'Terms & Privacy',
                  link: {
                    type: 'internal',
                    url: '/legal',
                  },
                },
              ],
            },
          ],
          bottomBar: {
            copyright: '© 2024 14 Voices. All rights reserved.',
            socialLinks: [
              {
                platform: 'linkedin',
                url: 'https://linkedin.com/company/14voices',
              },
              {
                platform: 'twitter',
                url: 'https://twitter.com/14voices',
              },
            ],
          },
          mobileSettings: {
            columnLayout: 'stacked',
            hideColumns: [],
          },
          style: {
            backgroundColor: '#1a1a1a',
            textColor: '#ffffff',
            linkColor: '#cccccc',
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

    console.log('Created footer block');

    // Create banner block (disabled by default)
    const bannerBlock = await payload.create({
      collection: 'blocks',
      data: {
        name: 'Announcement Banner',
        blockType: 'banner',
        banner: {
          enabled: false, // Disabled by default
          text: '🎉 New voices added! Check out our latest additions',
          link: {
            enabled: true,
            label: 'Explore Now',
            url: '/voice-samples?filter=new',
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

    console.log('Created banner block');

    // Create homepage layout with all blocks
    const homepageLayout = await payload.create({
      collection: 'layouts',
      data: {
        name: 'Homepage Layout',
        description: 'Default layout for the homepage',
        blocks: [navbarBlock.id, bannerBlock.id, heroBlock.id, footerBlock.id],
        isDefault: true,
        settings: {
          containerWidth: 'standard',
          spacing: {
            contentPadding: 'medium',
          },
        },
      },
    });

    console.log(`Created homepage layout with navbar, banner, hero, and footer`);

    // Update or create homepage
    const existingHomepage = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'home',
        },
      },
    });

    if (existingHomepage.docs.length === 0) {
      await payload.create({
        collection: 'pages',
        data: {
          title: 'Home',
          slug: 'home',
          layout: homepageLayout.id,
          status: 'published',
          showInNav: false, // Homepage usually not shown in nav
        },
      });
      console.log('Created homepage');
    } else {
      await payload.update({
        collection: 'pages',
        id: existingHomepage.docs[0].id,
        data: {
          layout: homepageLayout.id,
        },
      });
      console.log('Updated homepage with new layout');
    }

    console.log('\nDefault blocks setup completed successfully!');
    console.log('\nAdmins can now:');
    console.log('- Edit navbar links and logo in Blocks > Main Navbar');
    console.log('- Update hero text and CTAs in Blocks > Homepage Hero');
    console.log('- Modify footer links and copyright in Blocks > Main Footer');
    console.log('- Enable/disable announcement banner in Blocks > Announcement Banner');
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

createDefaultBlocks();
