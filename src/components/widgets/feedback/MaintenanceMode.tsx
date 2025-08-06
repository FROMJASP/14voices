import { Mail } from 'lucide-react';

interface MaintenanceModeProps {
  title?: string;
  message?: string;
  contactLabel?: string;
  contactEmail?: string;
  showContactEmail?: boolean;
}

export function MaintenanceMode({
  title,
  message,
  contactLabel,
  contactEmail,
  showContactEmail = true,
}: MaintenanceModeProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 mb-6">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-bold mb-4">{title || 'We zijn zo terug!'}</h1>

          <div className="text-lg text-white/70 max-w-md mx-auto">
            {message || 'We voeren momenteel gepland onderhoud uit. We zijn zo weer online.'}
          </div>
        </div>

        {showContactEmail && contactEmail && (
          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-sm text-white/50 mb-2">{contactLabel || 'Contact nodig?'}</p>
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-2 text-white hover:underline"
            >
              <Mail className="w-4 h-4" />
              {contactEmail}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
