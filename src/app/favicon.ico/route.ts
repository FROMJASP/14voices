import { NextResponse } from 'next/server';

// Generate a simple 16x16 favicon.ico programmatically
export async function GET() {
  // Create a simple 16x16 ICO file with "14" text
  // ICO file header for 1 image, 16x16, 32-bit color
  const icoHeader = Buffer.from([
    0x00,
    0x00, // Reserved
    0x01,
    0x00, // Type (1 = ICO)
    0x01,
    0x00, // Number of images (1)
    0x10, // Width (16)
    0x10, // Height (16)
    0x00, // Color palette (0 = no palette)
    0x00, // Reserved
    0x01,
    0x00, // Color planes (1)
    0x20,
    0x00, // Bits per pixel (32)
    0x68,
    0x01,
    0x00,
    0x00, // Size of image data (360 bytes for 16x16x32)
    0x16,
    0x00,
    0x00,
    0x00, // Offset to image data (22 bytes header)
  ]);

  // Create a simple 16x16 bitmap with green background and "14" text
  // This is a simplified BMP structure
  const bmpHeader = Buffer.from([
    // BMP Header
    0x28,
    0x00,
    0x00,
    0x00, // Header size (40 bytes)
    0x10,
    0x00,
    0x00,
    0x00, // Width (16)
    0x20,
    0x00,
    0x00,
    0x00, // Height (32 - doubled for ICO format)
    0x01,
    0x00, // Planes (1)
    0x20,
    0x00, // Bits per pixel (32)
    0x00,
    0x00,
    0x00,
    0x00, // Compression (none)
    0x00,
    0x01,
    0x00,
    0x00, // Image size (256 bytes)
    0x00,
    0x00,
    0x00,
    0x00, // X pixels per meter
    0x00,
    0x00,
    0x00,
    0x00, // Y pixels per meter
    0x00,
    0x00,
    0x00,
    0x00, // Colors used
    0x00,
    0x00,
    0x00,
    0x00, // Important colors
  ]);

  // Create pixel data (16x16 BGRA format)
  // Fill with green (#18f109) and add simple "14" pattern
  const pixels = [];
  const green = [0x09, 0xf1, 0x18, 0xff]; // BGRA format
  const black = [0x00, 0x00, 0x00, 0xff]; // BGRA format

  // Simple "14" pattern (very basic representation)
  const pattern = [
    '                ',
    '   ##    ##     ',
    '  ###    ##     ',
    '   ##    ##     ',
    '   ##    ##     ',
    '   ##  ######   ',
    '   ##    ##     ',
    '   ##    ##     ',
    '   ##    ##     ',
    '  ####   ##     ',
    '                ',
    '                ',
    '                ',
    '                ',
    '                ',
    '                ',
  ];

  // Generate pixel data (bottom-up for BMP format)
  for (let y = 15; y >= 0; y--) {
    for (let x = 0; x < 16; x++) {
      const pixel = pattern[y] && pattern[y][x] === '#' ? black : green;
      pixels.push(...pixel);
    }
  }

  // Add mask data (all visible - 16x16 bits = 32 bytes)
  const mask = Buffer.alloc(32, 0x00);

  // Combine all parts
  const pixelData = Buffer.from(pixels);
  const imageData = Buffer.concat([bmpHeader, pixelData, mask]);
  const icoFile = Buffer.concat([icoHeader, imageData]);

  return new NextResponse(icoFile, {
    headers: {
      'Content-Type': 'image/x-icon',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });
}
