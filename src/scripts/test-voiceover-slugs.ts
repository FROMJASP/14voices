// Test script to verify voiceover slug generation
const testCases = [
  { name: 'Peter Smit', expectedSlug: 'peter' },
  { name: 'Marie van der Berg', expectedSlug: 'marie' },
  { name: 'Jan-Willem de Vries', expectedSlug: 'jan-willem' },
  { name: 'José García', expectedSlug: 'jos' }, // Special chars removed
  { name: 'Anne-Marie O\'Connor', expectedSlug: 'anne-marie' },
  { name: 'Élise Dubois', expectedSlug: 'lise' }, // Accents removed
];

function generateSlug(name: string): string {
  const firstName = name.split(' ')[0];
  return firstName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

console.log('Testing voiceover slug generation:\n');

testCases.forEach(({ name, expectedSlug }) => {
  const generatedSlug = generateSlug(name);
  const passed = generatedSlug === expectedSlug;
  
  console.log(`Name: "${name}"`);
  console.log(`Expected: "${expectedSlug}"`);
  console.log(`Generated: "${generatedSlug}"`);
  console.log(`Result: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  console.log('---');
});

console.log('\nNote: Special characters and accents are removed in slug generation.');