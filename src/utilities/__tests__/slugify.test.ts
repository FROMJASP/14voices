import { slugify, slugifyVoiceoverName } from '../slugify';

describe('slugify', () => {
  it('handles common special characters correctly', () => {
    expect(slugify('Björn')).toBe('bjorn');
    expect(slugify('Åke')).toBe('ake');
    expect(slugify('Jürgen')).toBe('jurgen');
    expect(slugify('François')).toBe('francois');
    expect(slugify('José')).toBe('jose');
    expect(slugify('Søren')).toBe('soren');
    expect(slugify('Müller')).toBe('muller');
    expect(slugify('Niña')).toBe('nina');
    expect(slugify('André')).toBe('andre');
    expect(slugify('Zoë')).toBe('zoe');
  });

  it('handles uppercase and mixed case', () => {
    expect(slugify('BJÖRN')).toBe('bjorn');
    expect(slugify('BjÖrN')).toBe('bjorn');
  });

  it('handles spaces and multiple words', () => {
    expect(slugify('Björn Anderson')).toBe('bjorn-anderson');
    expect(slugify('Anna Maria')).toBe('anna-maria');
  });

  it('handles multiple special characters', () => {
    expect(slugify('Åsa-Björn')).toBe('asa-bjorn');
    expect(slugify('François-André')).toBe('francois-andre');
  });

  it('removes leading and trailing hyphens', () => {
    expect(slugify('  Björn  ')).toBe('bjorn');
    expect(slugify('--Björn--')).toBe('bjorn');
  });
});

describe('slugifyVoiceoverName', () => {
  it('uses only first name', () => {
    expect(slugifyVoiceoverName('Björn Anderson')).toBe('bjorn');
    expect(slugifyVoiceoverName('Anna Maria Johansson')).toBe('anna');
    expect(slugifyVoiceoverName('François-André Dupont')).toBe('francois-andre');
  });

  it('handles empty strings', () => {
    expect(slugifyVoiceoverName('')).toBe('');
    expect(slugifyVoiceoverName(' ')).toBe('');
  });

  it('handles single names', () => {
    expect(slugifyVoiceoverName('Björn')).toBe('bjorn');
    expect(slugifyVoiceoverName('André')).toBe('andre');
  });
});
