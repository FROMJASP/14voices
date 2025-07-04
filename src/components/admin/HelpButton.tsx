'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Map } from 'lucide-react';
import { startTour } from './AdminTours';
import { ShimmerButton } from '@/components/ui/shimmer-button';

export function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const tours = [
    {
      id: 'firstTime',
      title: 'Algemene Rondleiding',
      description: 'Een complete rondleiding door het admin panel',
      icon: '🎯',
    },
    {
      id: 'voiceoverTour',
      title: 'Voice-overs Beheren',
      description: "Leer hoe u voice-overs, foto's en demo's beheert",
      icon: '🎤',
    },
    {
      id: 'documentsTour',
      title: 'Documenten & Boekingen',
      description: 'Beheer boekingen, scripts en facturen',
      icon: '📋',
    },
    {
      id: 'pageTour',
      title: "Pagina's Bewerken",
      description: "Leer hoe u pagina's kunt aanpassen",
      icon: '📄',
    },
    {
      id: 'siteBuilderTour',
      title: 'Site Builder',
      description: 'Bouw uw website met layouts en blokken',
      icon: '🏗️',
    },
    {
      id: 'formTour',
      title: 'Formulieren',
      description: 'Maak en beheer formulieren',
      icon: '📝',
    },
    {
      id: 'emailTour',
      title: 'E-mail Campagnes',
      description: 'Stel e-mailcampagnes op',
      icon: '📧',
    },
    {
      id: 'bookingTour',
      title: 'Boekingen Beheren',
      description: 'Beheer voice-over boekingen',
      icon: '📅',
    },
  ];

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <ShimmerButton
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 shadow-lg z-50 px-4 py-3"
        shimmerColor="#3b82f6"
        background="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
        borderRadius="50px"
        aria-label="Help & Rondleiding"
      >
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5" />
          <span className="font-medium">Rondleiding</span>
        </div>
      </ShimmerButton>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div ref={modalRef} className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Help & Rondleidingen</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Kies een rondleiding om te leren hoe u het admin panel kunt gebruiken:
              </p>

              <div className="space-y-3">
                {tours.map((tour) => (
                  <button
                    key={tour.id}
                    onClick={() => {
                      setIsOpen(false);
                      setTimeout(() => {
                        startTour(tour.id as string);
                      }, 300);
                    }}
                    className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">{tour.icon}</span>
                      <div>
                        <h3 className="font-medium text-gray-900">{tour.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{tour.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium text-gray-900 mb-2">Snelle Tips:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>
                    • Klik op het <strong>+ Aanmaken</strong> knop om nieuwe content toe te voegen
                  </li>
                  <li>
                    • Gebruik de <strong>zoekbalk</strong> om snel content te vinden
                  </li>
                  <li>
                    • Wijzig uw <strong>taal</strong> in de account instellingen
                  </li>
                  <li>
                    • Bekijk de <strong>live preview</strong> om wijzigingen direct te zien
                  </li>
                </ul>
              </div>

              <div className="mt-4 text-center">
                <a
                  href="mailto:support@14voices.com"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Hulp nodig? Contact support
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
