export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 dark:border-gray-600 border-t-primary"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Laden...</p>
      </div>
    </div>
  );
}
