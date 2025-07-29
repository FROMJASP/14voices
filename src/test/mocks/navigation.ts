export const mockNavItems = [
  { label: 'Home', href: '/' },
  { label: 'Onze Stemmen', href: '/voiceovers' },
  { label: 'Over Ons', href: '/over-ons' },
  { label: 'Contact', href: '/contact' },
];

export const mockLanguages = {
  nl: {
    code: 'nl',
    name: 'Nederlands',
    switchText: 'Switch to English',
  },
  en: {
    code: 'en',
    name: 'English',
    switchText: 'Wissel naar Nederlands',
  },
};

export const createMockScrollEvent = (scrollY: number) => {
  window.scrollY = scrollY;
  window.dispatchEvent(new Event('scroll'));
};

export const waitForScrollEffect = async (expectedClassName: string, container: HTMLElement) => {
  return new Promise<void>((resolve) => {
    const checkClass = () => {
      const nav = container.querySelector('nav');
      if (nav?.className.includes(expectedClassName)) {
        resolve();
      } else {
        requestAnimationFrame(checkClass);
      }
    };
    checkClass();
  });
};
