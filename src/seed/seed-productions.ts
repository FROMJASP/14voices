import { getPayloadHMR } from '@payloadcms/next/utilities';
import configPromise from '@payload-config';

async function seedProductions() {
  const payload = await getPayloadHMR({ config: configPromise });

  console.log('🌱 Seeding productions...');

  const productions = [
    {
      name: 'Videoproductie',
      basePrice: 175,
      description:
        "Video's voor intern gebruik of online plaatsing, zonder advertentiebudget. Bij inzet als betaalde advertentie kies je voor 'Web Commercial'.",
      buyoutDuration: '12 maanden',
      pricingType: 'wordBased',
      wordPricingTiers: [
        { minWords: 0, maxWords: 250, additionalPrice: 0 },
        { minWords: 250, maxWords: 500, additionalPrice: 50 },
        { minWords: 500, maxWords: 1000, additionalPrice: 150 },
        { minWords: 1000, maxWords: 1500, additionalPrice: 225 },
      ],
      wordPricingFormula: {
        enabled: true,
        pricePerWord: 0.35,
        explanation: 'Voor scripts boven de 1500 woorden rekenen we €0,35 per extra woord.',
      },
      status: 'active',
      sortOrder: 1,
    },
    {
      name: 'E-learning',
      basePrice: 225,
      description: "Voor online trainingen, educatieve video's en instructievideo's.",
      buyoutDuration: '12 maanden',
      pricingType: 'wordBased',
      wordPricingTiers: [
        { minWords: 0, maxWords: 500, additionalPrice: 0 },
        { minWords: 500, maxWords: 1000, additionalPrice: 100 },
        { minWords: 1000, maxWords: 1500, additionalPrice: 175 },
        { minWords: 1500, maxWords: 2000, additionalPrice: 250 },
      ],
      wordPricingFormula: {
        enabled: true,
        pricePerWord: 0.4,
        explanation: 'Voor scripts boven de 2000 woorden rekenen we €0,40 per extra woord.',
      },
      status: 'active',
      sortOrder: 2,
    },
    {
      name: 'Radiospot',
      basePrice: 150,
      description: 'Radiocommercials voor regionaal of landelijk bereik.',
      buyoutDuration: '12 maanden',
      pricingType: 'versionBased',
      requiresRegion: true,
      versionPricing: [
        { versionCount: 1, regionalPrice: 150, nationalPrice: 400 },
        { versionCount: 2, regionalPrice: 340, nationalPrice: 765 },
        { versionCount: 3, regionalPrice: 460, nationalPrice: 1035 },
        { versionCount: 4, regionalPrice: 560, nationalPrice: 1260 },
        { versionCount: 5, regionalPrice: 640, nationalPrice: 1440 },
      ],
      status: 'active',
      sortOrder: 3,
    },
    {
      name: 'TV Commercial',
      basePrice: 250,
      description: 'Televisiecommercials voor regionaal of landelijk bereik.',
      buyoutDuration: '12 maanden',
      pricingType: 'versionBased',
      requiresRegion: true,
      versionPricing: [
        { versionCount: 1, regionalPrice: 250, nationalPrice: 550 },
        { versionCount: 2, regionalPrice: 510, nationalPrice: 1020 },
        { versionCount: 3, regionalPrice: 690, nationalPrice: 1380 },
        { versionCount: 4, regionalPrice: 840, nationalPrice: 1680 },
        { versionCount: 5, regionalPrice: 960, nationalPrice: 1920 },
      ],
      status: 'active',
      sortOrder: 4,
    },
    {
      name: 'Web Commercial',
      basePrice: 400,
      description: 'Online commercials voor social media en video advertising.',
      buyoutDuration: '12 maanden',
      pricingType: 'versionBased',
      requiresRegion: false,
      versionPricing: [
        { versionCount: 1, price: 400 },
        { versionCount: 2, price: 765 },
        { versionCount: 3, price: 1035 },
        { versionCount: 4, price: 1260 },
        { versionCount: 5, price: 1440 },
      ],
      status: 'active',
      sortOrder: 5,
    },
    {
      name: 'Voice Response',
      basePrice: 150,
      description: "Voice Response voor keuzemenu's (IVR), voicemails en wachtrijen.",
      buyoutDuration: '12 maanden',
      pricingType: 'wordBased',
      wordPricingTiers: [
        { minWords: 0, maxWords: 200, additionalPrice: 0 },
        { minWords: 200, maxWords: 500, additionalPrice: 50 },
        { minWords: 500, maxWords: 1000, additionalPrice: 125 },
        { minWords: 1000, maxWords: 1500, additionalPrice: 200 },
      ],
      wordPricingFormula: {
        enabled: true,
        pricePerWord: 0.3,
        explanation: 'Voor scripts boven de 1500 woorden rekenen we €0,30 per extra woord.',
      },
      status: 'active',
      sortOrder: 6,
    },
  ];

  for (const production of productions) {
    try {
      await payload.create({
        collection: 'productions',
        data: production as any, // Type assertion to avoid strict type checking
      });
      console.log(`✅ Created production: ${production.name}`);
    } catch (error: any) {
      console.error(`❌ Error creating production ${production.name}:`, error.message);
    }
  }

  console.log('✅ Productions seeding completed');
}

seedProductions()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
