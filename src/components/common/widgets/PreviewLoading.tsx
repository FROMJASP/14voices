import React from 'react';

export function PreviewLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="relative">
        {/* Animated loader */}
        <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-lg text-gray-600 font-medium">Preview wordt geladen...</p>
      <p className="mt-2 text-sm text-gray-500">Een moment geduld alstublieft</p>
    </div>
  );
}
