'use client';

import { useEffect, useRef } from 'react';
import { TourStylesShepherd } from './TourStylesShepherd';

// Lazy load Shepherd.js to avoid build issues
let Shepherd: any = null;

const loadShepherd = async () => {
  if (!Shepherd) {
    try {
      const shepherdModule = await import('shepherd.js');
      Shepherd = shepherdModule.default;

      // Import CSS dynamically on client-side only
      if (typeof window !== 'undefined') {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/shepherd.js@11.2.0/dist/css/shepherd.css';
        document.head.appendChild(link);
      }
    } catch (error) {
      console.error('Failed to load Shepherd.js:', error);
    }
  }
  return Shepherd;
};

// Tour configurations
const tours = {
  firstTime: {
    id: 'first-time-tour',
    steps: [
      {
        title: '👋 Welkom bij 14voices!',
        text: 'Dit is jouw admin dashboard waar je alle content kunt beheren.',
        buttons: [
          {
            text: 'Volgende',
            action: 'next',
            classes: 'shepherd-button-primary',
          },
        ],
      },
      {
        attachTo: {
          element: 'a[href*="/admin/collections/voiceovers"]',
          on: 'right',
        },
        title: '🎙️ Voice-overs Beheren',
        text: 'Hier kun je voiceovers toevoegen/verwijderen.',
        buttons: [
          {
            text: 'Vorige',
            action: 'back',
            classes: 'shepherd-button-secondary',
          },
          {
            text: 'Volgende',
            action: 'next',
            classes: 'shepherd-button-primary',
          },
        ],
      },
      {
        attachTo: {
          element: 'a[href*="/admin/collections/bookings"]',
          on: 'right',
        },
        title: '📅 Boekingen & Documenten',
        text: 'Beheer hier boekingen, scripts en facturen.',
        buttons: [
          {
            text: 'Vorige',
            action: 'back',
            classes: 'shepherd-button-secondary',
          },
          {
            text: 'Klaar',
            action: 'complete',
            classes: 'shepherd-button-success',
          },
        ],
      },
    ],
  },
  voiceoverTour: {
    id: 'voiceover-tour',
    steps: [
      {
        attachTo: {
          element: '.collection-list__header a.btn, a[href$="/create"]',
          on: 'left',
        },
        title: '➕ Nieuwe Voice-over',
        text: 'Klik hier om een nieuwe voice-over toe te voegen.',
        buttons: [
          {
            text: 'Klaar',
            action: 'complete',
            classes: 'shepherd-button-success',
          },
        ],
      },
    ],
  },
  pageTour: {
    id: 'page-tour',
    steps: [
      {
        attachTo: {
          element: '.collection-list__header a.btn, a[href$="/create"]',
          on: 'left',
        },
        title: '📄 Nieuwe Pagina',
        text: "Hier kun je nieuwe pagina's toevoegen aan je website.",
        buttons: [
          {
            text: 'Begrepen',
            action: 'complete',
            classes: 'shepherd-button-success',
          },
        ],
      },
    ],
  },
  formTour: {
    id: 'form-tour',
    steps: [
      {
        attachTo: {
          element: '.collection-list__header a.btn, a[href$="/create"]',
          on: 'left',
        },
        title: '📝 Nieuw Formulier',
        text: 'Maak hier nieuwe formulieren voor je website.',
        buttons: [
          {
            text: 'Begrepen',
            action: 'complete',
            classes: 'shepherd-button-success',
          },
        ],
      },
    ],
  },
  bookingTour: {
    id: 'booking-tour',
    steps: [
      {
        attachTo: {
          element: '.collection-list__header a.btn, a[href$="/create"]',
          on: 'left',
        },
        title: '📅 Nieuwe Boeking',
        text: 'Voeg hier nieuwe boekingen toe.',
        buttons: [
          {
            text: 'Begrepen',
            action: 'complete',
            classes: 'shepherd-button-success',
          },
        ],
      },
    ],
  },
  siteBuilderTour: {
    id: 'site-builder-tour',
    steps: [
      {
        title: '🏗️ Site Builder',
        text: 'Dit is het Site Builder gedeelte waar je layouts, blocks en sections kunt beheren.',
        buttons: [
          {
            text: 'Begrepen',
            action: 'complete',
            classes: 'shepherd-button-success',
          },
        ],
      },
    ],
  },
  emailTour: {
    id: 'email-tour',
    steps: [
      {
        title: '📧 Email Templates',
        text: 'Hier kun je email templates beheren voor verschillende communicatie.',
        buttons: [
          {
            text: 'Begrepen',
            action: 'complete',
            classes: 'shepherd-button-success',
          },
        ],
      },
    ],
  },
};

// Global instance to prevent multiple tours
let globalTour: any = null;

export function AdminTours() {
  const mountedRef = useRef(true);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('14voices_tour_completed');

    if (!hasSeenTour) {
      const timer = setTimeout(async () => {
        if (!mountedRef.current) return;

        // Load Shepherd.js
        const ShepherdLib = await loadShepherd();
        if (!ShepherdLib) {
          console.error('Shepherd.js not available');
          return;
        }

        // Destroy any existing instance
        if (globalTour) {
          try {
            globalTour.complete();
          } catch (e) {
            console.error('Error destroying tour:', e);
          }
          globalTour = null;
        }

        try {
          const tour = new ShepherdLib.Tour({
            useModalOverlay: true,
            defaultStepOptions: {
              classes: 'shepherd-theme-custom',
              scrollTo: { behavior: 'smooth', block: 'center' },
              cancelIcon: {
                enabled: true,
              },
              arrow: true,
              modalOverlayOpeningPadding: 8,
              modalOverlayOpeningRadius: 8,
            },
          });

          // Add steps
          tours.firstTime.steps.forEach((step, index) => {
            const shepherdStep: any = {
              id: `step-${index}`,
              title: step.title,
              text: step.text,
              buttons: step.buttons.map((btn) => ({
                text: btn.text,
                action: function () {
                  if (btn.action === 'next') tour.next();
                  else if (btn.action === 'back') tour.back();
                  else if (btn.action === 'complete') tour.complete();
                  else tour.cancel();
                },
                classes: btn.classes,
              })),
            };

            if (step.attachTo) {
              shepherdStep.attachTo = step.attachTo;
            }

            tour.addStep(shepherdStep);
          });

          // Event handlers
          tour.on('complete', () => {
            console.log('[Tour] Tour completed');
            localStorage.setItem('14voices_tour_completed', 'true');
            globalTour = null;
          });

          tour.on('cancel', () => {
            console.log('[Tour] Tour cancelled');
            localStorage.setItem('14voices_tour_completed', 'true');
            globalTour = null;
          });

          globalTour = tour;
          tour.start();
        } catch (error) {
          console.error('Error starting tour:', error);
        }
      }, 1500);

      return () => {
        clearTimeout(timer);
      };
    }

    return () => {
      mountedRef.current = false;
      if (globalTour) {
        try {
          globalTour.complete();
        } catch (e) {
          console.error('Error in cleanup:', e);
        }
        globalTour = null;
      }
    };
  }, []);

  return <TourStylesShepherd />;
}

// Function to start tours programmatically
export async function startTour(tourName: string) {
  // Load Shepherd.js
  const ShepherdLib = await loadShepherd();
  if (!ShepherdLib) {
    console.error('Shepherd.js not available');
    return;
  }

  // Destroy any existing tour
  if (globalTour) {
    try {
      globalTour.complete();
    } catch (e) {
      console.error('Error destroying existing tour:', e);
    }
    globalTour = null;
  }

  const tourConfig = (tours as any)[tourName];
  if (!tourConfig) {
    console.error('Tour not found:', tourName);
    return;
  }

  try {
    const tour = new ShepherdLib.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        classes: 'shepherd-theme-custom',
        scrollTo: { behavior: 'smooth', block: 'center' },
        cancelIcon: {
          enabled: true,
        },
        arrow: true,
        modalOverlayOpeningPadding: 4,
        modalOverlayOpeningRadius: 8,
      },
    });

    // Add steps
    tourConfig.steps.forEach((step: any, index: number) => {
      const shepherdStep: any = {
        id: `step-${index}`,
        title: step.title,
        text: step.text,
        buttons: step.buttons.map((btn: any) => ({
          text: btn.text,
          action: function () {
            if (btn.action === 'next') tour.next();
            else if (btn.action === 'back') tour.back();
            else if (btn.action === 'complete') tour.complete();
            else tour.cancel();
          },
          classes: btn.classes,
        })),
      };

      if (step.attachTo) {
        shepherdStep.attachTo = step.attachTo;
      }

      tour.addStep(shepherdStep);
    });

    // Event handlers
    tour.on('complete', () => {
      console.log('[Tour] Tour completed');
      globalTour = null;
    });

    tour.on('cancel', () => {
      console.log('[Tour] Tour cancelled');
      globalTour = null;
    });

    globalTour = tour;
    tour.start();
  } catch (error) {
    console.error('Failed to start tour:', error);
  }
}
