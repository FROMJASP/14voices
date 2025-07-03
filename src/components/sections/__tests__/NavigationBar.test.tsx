import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavigationBar } from '../NavigationBar';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    nav: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
      <nav {...props}>{children}</nav>
    ),
    div: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

describe('NavigationBar', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    // Reset scroll position
    window.scrollY = 0;
  });

  afterEach(() => {
    // Reset document.body.style.overflow
    document.body.style.overflow = 'unset';
  });

  describe('Rendering', () => {
    it('should render the logo with correct text', () => {
      render(<NavigationBar />);
      expect(screen.getByText('14voices')).toBeInTheDocument();
    });

    it('should render all navigation items', () => {
      render(<NavigationBar />);

      const navItems = ['Home', 'Onze Stemmen', 'Over Ons', 'Contact'];
      navItems.forEach((item) => {
        // Desktop navigation items
        expect(screen.getAllByText(item)[0]).toBeInTheDocument();
      });
    });

    it('should render the language switcher with default language', () => {
      render(<NavigationBar />);

      const langSwitchers = screen.getAllByText('nl');
      expect(langSwitchers.length).toBeGreaterThan(0);
    });

    it('should render mobile menu button on mobile', () => {
      render(<NavigationBar />);

      // Find button with Menu icon (it doesn't have accessible name)
      const buttons = screen.getAllByRole('button');
      const menuButton = buttons.find((button) => button.querySelector('.lucide-menu'));
      expect(menuButton).toBeInTheDocument();
      expect(menuButton).toHaveClass('md:hidden');
    });
  });

  describe('Scroll behavior', () => {
    it('should add scrolled styles when scrolled past threshold', async () => {
      const { container } = render(<NavigationBar />);

      // Initial state - not scrolled
      const nav = container.querySelector('nav');
      expect(nav?.className).toContain('bg-transparent');

      // Simulate scroll
      window.scrollY = 50;
      window.dispatchEvent(new Event('scroll'));

      await waitFor(() => {
        expect(nav?.className).toContain('bg-white/80');
        expect(nav?.className).toContain('backdrop-blur-lg');
        expect(nav?.className).toContain('shadow-lg');
      });
    });

    it('should remove scrolled styles when scrolled back to top', async () => {
      const { container } = render(<NavigationBar />);
      const nav = container.querySelector('nav');

      // Scroll down
      window.scrollY = 50;
      window.dispatchEvent(new Event('scroll'));

      await waitFor(() => {
        expect(nav?.className).toContain('bg-white/80');
      });

      // Scroll back up
      window.scrollY = 5;
      window.dispatchEvent(new Event('scroll'));

      await waitFor(() => {
        expect(nav?.className).toContain('bg-transparent');
      });
    });
  });

  describe('Mobile menu behavior', () => {
    it('should open mobile menu when menu button is clicked', async () => {
      render(<NavigationBar />);

      const buttons = screen.getAllByRole('button');
      const menuButton = buttons.find((button) => button.querySelector('.lucide-menu'));
      expect(menuButton).toBeInTheDocument();
      await user.click(menuButton!);

      // Check if mobile menu is visible
      await waitFor(() => {
        expect(screen.getByText('Switch to English')).toBeInTheDocument();
      });
    });

    it('should close mobile menu when close button is clicked', async () => {
      render(<NavigationBar />);

      // Open menu
      const buttons = screen.getAllByRole('button');
      const menuButton = buttons.find((button) => button.querySelector('.lucide-menu'));
      expect(menuButton).toBeInTheDocument();
      await user.click(menuButton!);

      // Find and click close button (X icon)
      const closeButtons = screen
        .getAllByRole('button')
        .filter((button) => button.querySelector('svg')?.classList.contains('lucide-x'));

      expect(closeButtons.length).toBeGreaterThan(0);
      await user.click(closeButtons[0]);

      // Check if mobile menu is hidden
      await waitFor(() => {
        expect(screen.queryByText('Switch to English')).not.toBeInTheDocument();
      });
    });

    it('should close mobile menu when backdrop is clicked', async () => {
      const { container } = render(<NavigationBar />);

      // Open menu
      const buttons = screen.getAllByRole('button');
      const menuButton = buttons.find((button) => button.querySelector('.lucide-menu'));
      expect(menuButton).toBeInTheDocument();
      await user.click(menuButton!);

      // Click backdrop
      const backdrop = container.querySelector('.bg-black\\/50');
      expect(backdrop).toBeInTheDocument();

      if (backdrop) {
        await user.click(backdrop);
      }

      // Check if mobile menu is hidden
      await waitFor(() => {
        expect(screen.queryByText('Switch to English')).not.toBeInTheDocument();
      });
    });

    it('should close mobile menu when a navigation link is clicked', async () => {
      render(<NavigationBar />);

      // Open menu
      const buttons = screen.getAllByRole('button');
      const menuButton = buttons.find((button) => button.querySelector('.lucide-menu'));
      expect(menuButton).toBeInTheDocument();
      await user.click(menuButton!);

      // Click a navigation link in mobile menu
      const mobileNavLinks = screen.getAllByText('Home');
      const mobileLink = mobileNavLinks[mobileNavLinks.length - 1]; // Get the mobile version
      await user.click(mobileLink);

      // Check if mobile menu is hidden
      await waitFor(() => {
        expect(screen.queryByText('Switch to English')).not.toBeInTheDocument();
      });
    });

    it('should set body overflow to hidden when mobile menu is open', async () => {
      render(<NavigationBar />);

      expect(document.body.style.overflow).toBe('unset');

      const buttons = screen.getAllByRole('button');
      const menuButton = buttons.find((button) => button.querySelector('.lucide-menu'));
      expect(menuButton).toBeInTheDocument();
      await user.click(menuButton!);

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden');
      });
    });

    it('should reset body overflow when mobile menu is closed', async () => {
      render(<NavigationBar />);

      // Open menu
      const buttons = screen.getAllByRole('button');
      const menuButton = buttons.find((button) => button.querySelector('.lucide-menu'));
      expect(menuButton).toBeInTheDocument();
      await user.click(menuButton!);

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden');
      });

      // Close menu
      const closeButtons = screen
        .getAllByRole('button')
        .filter((button) => button.querySelector('svg')?.classList.contains('lucide-x'));
      await user.click(closeButtons[0]);

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('unset');
      });
    });
  });

  describe('Language switcher', () => {
    it('should toggle language when language button is clicked', async () => {
      render(<NavigationBar />);

      // Desktop language switcher
      const langButtons = screen.getAllByText('nl');
      const desktopLangButton = langButtons[0].closest('button');

      expect(desktopLangButton).toBeInTheDocument();

      if (desktopLangButton) {
        await user.click(desktopLangButton);

        await waitFor(() => {
          expect(screen.getAllByText('en')[0]).toBeInTheDocument();
        });

        // Toggle back
        const enButtons = screen.getAllByText('en');
        const enButton = enButtons[0].closest('button');

        if (enButton) {
          await user.click(enButton);

          await waitFor(() => {
            expect(screen.getAllByText('nl')[0]).toBeInTheDocument();
          });
        }
      }
    });

    it('should display correct language text in mobile menu', async () => {
      render(<NavigationBar />);

      // Open mobile menu
      const buttons = screen.getAllByRole('button');
      const menuButton = buttons.find((button) => button.querySelector('.lucide-menu'));
      expect(menuButton).toBeInTheDocument();
      await user.click(menuButton!);

      // Check initial language
      expect(screen.getByText('Switch to English')).toBeInTheDocument();

      // Toggle language
      const mobileLangButton = screen.getByText('Switch to English').closest('button');

      if (mobileLangButton) {
        await user.click(mobileLangButton);

        await waitFor(() => {
          expect(screen.getByText('Wissel naar Nederlands')).toBeInTheDocument();
        });
      }
    });
  });

  describe('Navigation links', () => {
    it('should have correct href attributes', () => {
      render(<NavigationBar />);

      const links = [
        { text: 'Home', href: '/' },
        { text: 'Onze Stemmen', href: '/voiceovers' },
        { text: 'Over Ons', href: '/over-ons' },
        { text: 'Contact', href: '/contact' },
      ];

      links.forEach(({ text, href }) => {
        const linkElements = screen.getAllByText(text);
        linkElements.forEach((element) => {
          const link = element.closest('a');
          if (link) {
            expect(link.getAttribute('href')).toBe(href);
          }
        });
      });
    });

    it('should have logo link pointing to home', () => {
      render(<NavigationBar />);

      const logoLinks = screen.getAllByText('14voices');
      logoLinks.forEach((logo) => {
        const link = logo.closest('a');
        if (link) {
          expect(link.getAttribute('href')).toBe('/');
        }
      });
    });
  });

  describe('Cleanup', () => {
    it('should remove scroll event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = render(<NavigationBar />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });

    it('should reset body overflow on unmount', async () => {
      const { unmount } = render(<NavigationBar />);

      // Open mobile menu
      const buttons = screen.getAllByRole('button');
      const menuButton = buttons.find((button) => button.querySelector('.lucide-menu'));
      expect(menuButton).toBeInTheDocument();
      await user.click(menuButton!);

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden');
      });

      unmount();

      expect(document.body.style.overflow).toBe('unset');
    });
  });
});
