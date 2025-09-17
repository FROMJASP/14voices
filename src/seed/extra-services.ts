import type { Payload } from 'payload';

export const seedExtraServices = async (payload: Payload) => {
  console.log('🌱 Seeding extra services...');

  // First, get all production IDs
  const productionsResult = await payload.find({
    collection: 'productions',
    limit: 100,
  });

  const productionsByName = productionsResult.docs.reduce(
    (acc, prod) => {
      acc[prod.name] = prod.id;
      return acc;
    },
    {} as Record<string, number>
  );

  const extraServices = [
    {
      name: 'Audio Cleanup',
      slug: 'audio-cleanup',
      basePrice: 50,
      description: 'Professionele audio nabewerking en opschoning',
      infoText:
        'Al onze opnames worden standaard onbewerkt opgeleverd. Er kunnen dus ademhalingen, smakjes en andere oneffenheden te horen zijn. Kies Audio Cleanup wanneer je een volledig opgeschoond en geprocessed bestand wilt ontvangen dat kant en klaar te gebruiken is.',
      productions: [
        productionsByName['Videoproductie'],
        productionsByName['E-learning'],
        productionsByName['Radiospot'],
        productionsByName['TV Commercial'],
        productionsByName['Web Commercial'],
        productionsByName['Voice Response'],
      ],
      productionPriceOverrides: [],
      dependencies: [],
      status: 'active',
      sortOrder: 1,
    },
    {
      name: 'Editing',
      slug: 'editing',
      basePrice: 50,
      description: 'Montage en bewerking van de opname',
      infoText:
        'Onder deze categorie vallen producties zoals bedrijfsfilms, documentaires, audiotours, etc.',
      productions: [
        productionsByName['Videoproductie'],
        productionsByName['E-learning'],
        productionsByName['Radiospot'],
        productionsByName['TV Commercial'],
        productionsByName['Web Commercial'],
      ],
      productionPriceOverrides: [],
      dependencies: [],
      status: 'active',
      sortOrder: 2,
    },
    {
      name: 'Mixage',
      slug: 'mixage',
      basePrice: 100,
      description: 'Professionele afmix met muziek en effecten',
      infoText:
        'Opname uitzendklaar door ons laten afmixen? Wij maken de perfecte radio- tv, of webmixage voor je zodat je productie goed klinkt en meteen gebruikt kan worden.',
      productions: [
        productionsByName['Videoproductie'],
        productionsByName['E-learning'],
        productionsByName['Radiospot'],
        productionsByName['TV Commercial'],
        productionsByName['Web Commercial'],
      ],
      productionPriceOverrides: [],
      dependencies: [], // Will be updated after all services are created
      status: 'active',
      sortOrder: 3,
    },
    {
      name: 'Sound Design',
      slug: 'sound-design',
      basePrice: 100,
      description: 'Toevoegen van geluidseffecten en sfeer',
      infoText:
        'Professionele geluidseffecten en sfeergeluiden toevoegen aan je productie voor extra impact.',
      productions: [
        productionsByName['Videoproductie'],
        productionsByName['E-learning'],
        productionsByName['Radiospot'],
        productionsByName['TV Commercial'],
        productionsByName['Web Commercial'],
      ],
      productionPriceOverrides: [],
      dependencies: [],
      status: 'active',
      sortOrder: 4,
    },
    {
      name: 'Klantregie',
      slug: 'klantregie',
      basePrice: 75,
      description: 'Live meekijken en aanwijzingen geven tijdens opname',
      infoText:
        'Via een videoverbinding kun je live meekijken en aanwijzingen geven tijdens de opname.',
      productions: [
        productionsByName['Videoproductie'],
        productionsByName['E-learning'],
        productionsByName['Radiospot'],
        productionsByName['TV Commercial'],
        productionsByName['Web Commercial'],
        productionsByName['Voice Response'],
      ],
      productionPriceOverrides: [],
      dependencies: [],
      status: 'active',
      sortOrder: 5,
    },
    {
      name: 'Spoed',
      slug: 'spoed',
      basePrice: 150,
      description: 'Levering binnen 24 uur',
      infoText: 'Heeft u de opname snel nodig? Met onze spoedservice leveren we binnen 24 uur.',
      productions: [
        productionsByName['Videoproductie'],
        productionsByName['E-learning'],
        productionsByName['Radiospot'],
        productionsByName['TV Commercial'],
        productionsByName['Web Commercial'],
        productionsByName['Voice Response'],
      ],
      productionPriceOverrides: [],
      dependencies: [],
      status: 'active',
      sortOrder: 6,
    },
    {
      name: 'Meerdere stemmen',
      slug: 'meerdere-stemmen',
      basePrice: 200,
      description: 'Toevoegen van extra voice-over artiesten',
      infoText:
        'Heeft uw productie meerdere stemmen nodig? Wij regelen de perfecte combinatie van voice-over artiesten.',
      productions: [
        productionsByName['Videoproductie'],
        productionsByName['E-learning'],
        productionsByName['Radiospot'],
        productionsByName['TV Commercial'],
        productionsByName['Web Commercial'],
      ],
      productionPriceOverrides: [
        {
          production: productionsByName['E-learning'],
          overridePrice: 250,
        },
      ],
      dependencies: [],
      status: 'active',
      sortOrder: 7,
    },
  ];

  // Create all services first
  const createdServices: Record<string, string> = {};

  for (const service of extraServices) {
    try {
      const created = await payload.create({
        collection: 'extra-services',
        data: service as any,
      });
      createdServices[service.slug] = created.id;
      console.log(`✅ Created extra service: ${service.name}`);
    } catch (error: any) {
      console.error(`❌ Error creating extra service ${service.name}:`, error.message);
    }
  }

  // Update Mixage to have Editing as dependency
  if (createdServices['mixage'] && createdServices['editing']) {
    try {
      await payload.update({
        collection: 'extra-services',
        id: createdServices['mixage'],
        data: {
          dependencies: [createdServices['editing']],
        },
      });
      console.log('✅ Updated Mixage dependencies');
    } catch (error: any) {
      console.error('❌ Error updating Mixage dependencies:', error.message);
    }
  }

  console.log('✅ Extra services seeding completed');
};
