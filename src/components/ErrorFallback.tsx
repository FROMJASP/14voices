'use client';

export function ErrorFallback() {
  return (
    <div className="min-h-screen bg-white dark:bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          14voices
        </h1>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Er ging iets mis
        </h2>
        <p className="text-muted-foreground mb-6">
          We konden de pagina niet laden. Controleer je internetverbinding en probeer het opnieuw.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Probeer opnieuw
        </button>
      </div>
    </div>
  );
}