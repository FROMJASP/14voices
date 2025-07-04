'use client';

import { useEffect, useRef } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import './driver-theme.css';

interface TourStep {
  element: string;
  popover: {
    title: string;
    description: string;
    position: 'top' | 'right' | 'bottom' | 'left';
  };
}

interface TourConfig {
  id: string;
  title: string;
  description: string;
  steps: TourStep[];
}

// Singleton pattern to prevent multiple instances
let globalDriverInstance: ReturnType<typeof driver> | null = null;
let isDriverActive = false;

const tours: Record<string, TourConfig> = {
  firstTime: {
    id: 'first-time-tour',
    title: 'Welkom bij 14voices Admin',
    description: 'Laten we een korte rondleiding maken door het admin panel',
    steps: [
      {
        element: '.template-default__nav',
        popover: {
          title: '👋 Welkom bij 14voices!',
          description:
            'Dit is jouw admin dashboard waar je alle content kunt beheren. Tip: De rondleiding past zich aan op basis van de pagina waar je bent - klik op "Rondleiding" voor specifieke hulp per sectie!',
          position: 'bottom',
        },
      },
      {
        element: 'a[href*="/admin/collections/voiceovers"]',
        popover: {
          title: '🎙️ Voice-overs Beheren',
          description:
            "Hier kun je voiceovers toevoegen/verwijderen, foto's en demo's uploaden, en bepalen welke voiceovers je op de website wil laten zien.",
          position: 'right',
        },
      },
      {
        element: 'a[href*="/admin/collections/bookings"]',
        popover: {
          title: '📅 Boekingen & Documenten',
          description:
            'Beheer hier boekingen, scripts van klanten, en facturen. Alles op één plek!',
          position: 'right',
        },
      },
      {
        element: 'a[href*="/admin/collections/pages"]',
        popover: {
          title: "📄 Pagina's Beheren",
          description:
            "Pas hier de pagina's aan van de website zoals bijv. de content, SEO-instellingen, etc.",
          position: 'right',
        },
      },
      {
        element: 'a[href*="/admin/collections/media"]',
        popover: {
          title: '🖼️ Media Bibliotheek',
          description:
            "Hier vind je alle geüploade bestanden: voiceover foto's, demo's, en andere media.",
          position: 'right',
        },
      },
    ],
  },
  voiceoverTour: {
    id: 'voiceover-tour',
    title: 'Voice-over Beheer',
    description: 'Leer hoe je voice-overs kunt beheren',
    steps: [
      {
        element: '.collection-list__header a.btn',
        popover: {
          title: '➕ Nieuwe Voice-over Toevoegen',
          description: 'Klik hier om een nieuwe voice-over artiest toe te voegen.',
          position: 'left',
        },
      },
      {
        element: '.cell-name',
        popover: {
          title: '✏️ Voice-over Bewerken',
          description: 'Klik op een naam om de voice-over te bewerken.',
          position: 'right',
        },
      },
      {
        element: 'input[placeholder*="Search"]',
        popover: {
          title: '🔍 Zoeken',
          description: 'Gebruik de zoekbalk om snel een voice-over te vinden.',
          position: 'bottom',
        },
      },
      {
        element: '.cell-status',
        popover: {
          title: '📊 Status',
          description: 'Bekijk of een voice-over actief, concept of gearchiveerd is.',
          position: 'left',
        },
      },
    ],
  },
  pageTour: {
    id: 'page-tour',
    title: "Pagina's Beheren",
    description: "Leer hoe je pagina's kunt aanpassen",
    steps: [
      {
        element: '.collection-list__header a.btn',
        popover: {
          title: '➕ Nieuwe Pagina',
          description: 'Maak een nieuwe pagina voor je website.',
          position: 'left',
        },
      },
      {
        element: '.cell-title',
        popover: {
          title: '✏️ Pagina Bewerken',
          description: 'Klik op een titel om de pagina te bewerken.',
          position: 'right',
        },
      },
      {
        element: '.cell-slug',
        popover: {
          title: '🔗 URL Slug',
          description: 'Dit is het pad waar de pagina te vinden is op je website.',
          position: 'left',
        },
      },
    ],
  },
  formTour: {
    id: 'form-tour',
    title: 'Formulieren Beheren',
    description: 'Leer hoe je formulieren kunt maken en beheren',
    steps: [
      {
        element: '.collection-list__header a.btn',
        popover: {
          title: '➕ Nieuw Formulier',
          description: 'Maak een nieuw formulier voor je website.',
          position: 'left',
        },
      },
      {
        element: '.cell-title',
        popover: {
          title: '✏️ Formulier Bewerken',
          description: 'Klik om formuliervelden en instellingen te bewerken.',
          position: 'right',
        },
      },
      {
        element: '.cell-submissions',
        popover: {
          title: '📥 Inzendingen',
          description: 'Zie hoeveel keer dit formulier is ingevuld.',
          position: 'left',
        },
      },
    ],
  },
  emailTour: {
    id: 'email-tour',
    title: 'E-mail Campagnes',
    description: 'Leer hoe je e-mailcampagnes kunt opzetten',
    steps: [
      {
        element: 'a[href*="/admin/collections/email-campaigns"]',
        popover: {
          title: '📧 E-mail Campagnes',
          description: 'Beheer je e-mailcampagnes hier.',
          position: 'right',
        },
      },
      {
        element: 'a[href*="/admin/collections/email-templates"]',
        popover: {
          title: '📝 E-mail Templates',
          description: 'Maak herbruikbare e-mail templates.',
          position: 'right',
        },
      },
      {
        element: 'a[href*="/admin/collections/email-contacts"]',
        popover: {
          title: '👥 Contacten',
          description: 'Beheer je e-mail contactenlijst.',
          position: 'right',
        },
      },
    ],
  },
  bookingTour: {
    id: 'booking-tour',
    title: 'Boekingen Beheren',
    description: 'Leer hoe je boekingen kunt beheren',
    steps: [
      {
        element: '.collection-list__header',
        popover: {
          title: '📅 Boekingen Overzicht',
          description: 'Hier zie je alle boekingen voor voice-over projecten.',
          position: 'bottom',
        },
      },
      {
        element: '.cell-status',
        popover: {
          title: '🔄 Boekingstatus',
          description: 'Bekijk de status: Nieuw, Bevestigd, In Productie, of Voltooid.',
          position: 'left',
        },
      },
      {
        element: '.cell-voiceover',
        popover: {
          title: '🎤 Voice-over Artiest',
          description: 'Zie welke artiest voor dit project is geboekt.',
          position: 'right',
        },
      },
    ],
  },
  siteBuilderTour: {
    id: 'site-builder-tour',
    title: 'Site Builder',
    description: 'Leer hoe je je website kunt bouwen',
    steps: [
      {
        element: 'a[href*="/admin/collections/layouts"]',
        popover: {
          title: '🏗️ Layouts',
          description: "Beheer de algemene structuur van je pagina's (header, footer, etc).",
          position: 'right',
        },
      },
      {
        element: 'a[href*="/admin/collections/blocks"]',
        popover: {
          title: '🧱 Herbruikbare Blokken',
          description: "Maak blokken die je op meerdere pagina's kunt gebruiken.",
          position: 'right',
        },
      },
      {
        element: 'a[href*="/admin/collections/sections"]',
        popover: {
          title: '📑 Secties',
          description: 'Bouw complexe paginasecties met meerdere componenten.',
          position: 'right',
        },
      },
      {
        element: 'a[href*="/admin/collections/forms"]',
        popover: {
          title: '📝 Formulieren',
          description: 'Maak contactformulieren en andere interactieve elementen.',
          position: 'right',
        },
      },
    ],
  },
  documentsTour: {
    id: 'documents-tour',
    title: 'Documenten Beheer',
    description: 'Leer hoe je documenten kunt beheren',
    steps: [
      {
        element: 'a[href*="/admin/collections/bookings"]',
        popover: {
          title: '📅 Boekingen',
          description: 'Bekijk en beheer alle boekingen voor voice-over projecten.',
          position: 'right',
        },
      },
      {
        element: 'a[href*="/admin/collections/scripts"]',
        popover: {
          title: '📝 Scripts',
          description: 'Scripts die door klanten zijn geüpload voor voice-over werk.',
          position: 'right',
        },
      },
      {
        element: 'a[href*="/admin/collections/invoices"]',
        popover: {
          title: '💰 Facturen',
          description: 'Beheer facturen met beveiligde toegang voor klanten.',
          position: 'right',
        },
      },
    ],
  },
};

// Safe cleanup function
const safeDestroyDriver = () => {
  if (globalDriverInstance) {
    try {
      globalDriverInstance.destroy();
    } catch {
      // Silently ignore destroy errors
    }
  }
  // Always reset these regardless of driver state
  globalDriverInstance = null;
  isDriverActive = false;
};

export function AdminTours() {
  const mountedRef = useRef(true);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    mountedRef.current = true;

    // Check if it's the user's first time
    const hasSeenTour = localStorage.getItem('14voices_tour_completed');

    if (!hasSeenTour) {
      // Clean up any existing instance first
      safeDestroyDriver();

      // Wait for page to stabilize
      initTimeoutRef.current = setTimeout(() => {
        if (!mountedRef.current) return;

        try {
          // Ensure we don't have multiple instances
          if (isDriverActive) return;

          isDriverActive = true;
          const driverObj = driver({
            showProgress: true,
            showButtons: ['next', 'previous', 'close'],
            steps: tours.firstTime.steps,
            nextBtnText: 'Volgende',
            prevBtnText: 'Vorige',
            doneBtnText: 'Klaar',
            animate: true,
            smoothScroll: true,
            allowClose: true,
            disableActiveInteraction: true,
            stagePadding: 8,
            popoverOffset: 12,
            overlayClickNext: false,
            onNextClick: (element, step, options) => {
              // If this is the last step and user clicks "Klaar", destroy the tour
              if (
                step.popover &&
                options.config.steps &&
                options.config.steps.indexOf(step) === options.config.steps.length - 1
              ) {
                safeDestroyDriver();
                return;
              }
              driverObj.moveNext();
            },
            onDestroyStarted: () => {
              if (!mountedRef.current) return;

              try {
                localStorage.setItem('14voices_tour_completed', 'true');
              } catch {}

              // Defer cleanup to next tick
              setTimeout(() => {
                isDriverActive = false;
                globalDriverInstance = null;
              }, 0);
            },
            onCloseClick: () => {
              safeDestroyDriver();
            },
            onPopoverRender: (popover) => {
              // Add event listener for clicks outside the popover
              const handleOutsideClick = (e: MouseEvent) => {
                const target = e.target as HTMLElement;
                const isClickInsidePopover = popover.wrapper.contains(target);
                const isClickOnHighlightedElement = popover.element?.contains(target);

                if (!isClickInsidePopover && !isClickOnHighlightedElement) {
                  safeDestroyDriver();
                  document.removeEventListener('click', handleOutsideClick);
                }
              };

              // Add slight delay to prevent immediate close from the click that opened the tour
              setTimeout(() => {
                document.addEventListener('click', handleOutsideClick);
              }, 100);

              // Clean up listener when popover is destroyed
              const originalDestroy = popover.destroy;
              popover.destroy = () => {
                document.removeEventListener('click', handleOutsideClick);
                originalDestroy.call(popover);
              };
            },
          });
          globalDriverInstance = driverObj;

          if (globalDriverInstance && mountedRef.current) {
            globalDriverInstance.drive();
          }
        } catch {
          console.error('Error starting tour');
          safeDestroyDriver();
        }
      }, 1500);
    }

    // Cleanup function
    return () => {
      mountedRef.current = false;

      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = null;
      }

      // Defer cleanup to avoid React errors
      requestAnimationFrame(() => {
        safeDestroyDriver();
      });
    };
  }, []);

  return null;
}

// Function to start specific tours programmatically
export function startTour(tourName: keyof typeof tours) {
  const tour = tours[tourName];
  if (!tour) return;

  // Ensure no other tour is active
  safeDestroyDriver();

  try {
    isDriverActive = true;
    const driverObj = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      steps: tour.steps,
      nextBtnText: 'Volgende',
      prevBtnText: 'Vorige',
      doneBtnText: 'Klaar',
      animate: true,
      smoothScroll: true,
      allowClose: true,
      disableActiveInteraction: true,
      stagePadding: 8,
      popoverOffset: 12,
      overlayClickNext: false,
      onNextClick: (element, step, options) => {
        // If this is the last step and user clicks "Klaar", destroy the tour
        if (
          step.popover &&
          options.config.steps &&
          options.config.steps.indexOf(step) === options.config.steps.length - 1
        ) {
          safeDestroyDriver();
          return;
        }
        driverObj.moveNext();
      },
      onDestroyStarted: () => {
        setTimeout(() => {
          isDriverActive = false;
          if (globalDriverInstance === driverObj) {
            globalDriverInstance = null;
          }
        }, 0);
      },
      onCloseClick: () => {
        safeDestroyDriver();
      },
      onPopoverRender: (popover) => {
        // Add event listener for clicks outside the popover
        const handleOutsideClick = (e: MouseEvent) => {
          const target = e.target as HTMLElement;
          const isClickInsidePopover = popover.wrapper.contains(target);
          const isClickOnHighlightedElement = popover.element?.contains(target);

          if (!isClickInsidePopover && !isClickOnHighlightedElement) {
            safeDestroyDriver();
            document.removeEventListener('click', handleOutsideClick);
          }
        };

        // Add slight delay to prevent immediate close from the click that opened the tour
        setTimeout(() => {
          document.addEventListener('click', handleOutsideClick);
        }, 100);

        // Clean up listener when popover is destroyed
        const originalDestroy = popover.destroy;
        popover.destroy = () => {
          document.removeEventListener('click', handleOutsideClick);
          originalDestroy.call(popover);
        };
      },
    });

    globalDriverInstance = driverObj;
    driverObj.drive();
  } catch {
    console.error('Failed to start tour');
    safeDestroyDriver();
  }
}
