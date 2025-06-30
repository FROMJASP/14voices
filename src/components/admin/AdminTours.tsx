'use client'

import { useEffect } from 'react'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import './driver-theme.css'

interface TourStep {
  element: string
  popover: {
    title: string
    description: string
    position: 'top' | 'right' | 'bottom' | 'left'
  }
}

interface TourConfig {
  id: string
  title: string
  description: string
  steps: TourStep[]
}

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
          description: 'Dit is jouw admin dashboard waar je alle content kunt beheren. Tip: De rondleiding past zich aan op basis van de pagina waar je bent - klik op "Rondleiding" voor specifieke hulp per sectie!',
          position: 'bottom',
        },
      },
      {
        element: 'a[href*="/admin/collections/voiceovers"]',
        popover: {
          title: '🎙️ Voice-overs Beheren',
          description: 'Hier kun je voiceovers toevoegen/verwijderen en bepalen welke voiceovers je op de website wil laten zien, hoe je ze wil laten zien en waar je ze wil laten zien.',
          position: 'right',
        },
      },
      {
        element: 'a[href*="/admin/collections/pages"]',
        popover: {
          title: '📄 Pagina\'s Beheren',
          description: 'Pas hier de pagina\'s aan van de website zoals bijv. de content, SEO-instellingen, etc.',
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
    title: 'Pagina\'s Beheren',
    description: 'Leer hoe je pagina\'s kunt aanpassen',
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
          description: 'Beheer de algemene structuur van je pagina\'s (header, footer, etc).',
          position: 'right',
        },
      },
      {
        element: 'a[href*="/admin/collections/blocks"]',
        popover: {
          title: '🧱 Herbruikbare Blokken',
          description: 'Maak blokken die je op meerdere pagina\'s kunt gebruiken.',
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
}

export function AdminTours() {
  useEffect(() => {
    // Check if it's the user's first time
    const hasSeenTour = localStorage.getItem('14voices_tour_completed')
    
    if (!hasSeenTour) {
      // Wait a bit for the page to load
      setTimeout(() => {
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
          onDestroyStarted: () => {
            localStorage.setItem('14voices_tour_completed', 'true')
            driverObj.destroy()
          },
        })
        
        driverObj.drive()
      }, 1000)
    }
  }, [])

  return null
}

// Function to start specific tours programmatically
export function startTour(tourName: keyof typeof tours) {
  const tour = tours[tourName]
  if (!tour) return

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
  })

  driverObj.drive()
}