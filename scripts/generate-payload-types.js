#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🔄 Generating Payload types...');

// Use the build output to generate types
const child = spawn('bun', ['run', 'payload', 'generate:types'], {
  stdio: 'inherit',
  cwd: path.resolve(__dirname, '..'),
  env: {
    ...process.env,
    NODE_ENV: 'development'
  }
});

child.on('error', (error) => {
  console.error('❌ Failed to generate types:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  if (code === 0) {
    console.log('✅ Types generated successfully!');
  } else {
    console.error('❌ Type generation failed with code:', code);
    
    // If standard generation fails, manually add FAQ type
    console.log('📝 Adding FAQ type manually...');
    const fs = require('fs');
    const typesPath = path.join(__dirname, '..', 'src', 'payload-types.ts');
    
    // Read current types
    let content = fs.readFileSync(typesPath, 'utf8');
    
    // Check if FAQ type already exists
    if (!content.includes('export interface FAQ')) {
      // Add FAQ type after the Testimonial interface
      const faqType = `
export interface FAQ {
  id: string;
  question: string;
  answer?: {
    [k: string]: unknown;
  } | null;
  category?: ('general' | 'pricing' | 'technical' | 'delivery' | 'other') | null;
  order?: number | null;
  published?: boolean | null;
  createdAt: string;
  updatedAt: string;
}
`;
      
      // Find a good place to insert it
      const testimonialIndex = content.indexOf('export interface Testimonial');
      if (testimonialIndex !== -1) {
        // Find the end of Testimonial interface
        let braceCount = 0;
        let i = content.indexOf('{', testimonialIndex);
        let endIndex = i;
        
        while (i < content.length) {
          if (content[i] === '{') braceCount++;
          if (content[i] === '}') braceCount--;
          if (braceCount === 0) {
            endIndex = i + 1;
            break;
          }
          i++;
        }
        
        // Insert FAQ type after Testimonial
        content = content.slice(0, endIndex) + '\n' + faqType + content.slice(endIndex);
        
        // Update Config type to include FAQ
        const configMatch = content.match(/export interface Config \{[\s\S]*?collections: \{([\s\S]*?)\};/);
        if (configMatch) {
          const collectionsContent = configMatch[1];
          if (!collectionsContent.includes('faq:')) {
            const updatedCollections = collectionsContent.replace(
              /testimonials: Testimonial;/,
              'testimonials: Testimonial;\n    faq: FAQ;'
            );
            content = content.replace(collectionsContent, updatedCollections);
          }
        }
        
        fs.writeFileSync(typesPath, content);
        console.log('✅ FAQ type added manually!');
      }
    }
  }
});