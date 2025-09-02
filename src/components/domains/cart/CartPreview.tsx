'use client';

import React from 'react';
import { Package, Clock, User, ChevronRight, Shield, Sparkles } from 'lucide-react';
import { Bricolage_Grotesque } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

const bricolageGrotesque = Bricolage_Grotesque({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage',
});

interface CartItem {
  id: string;
  name: string;
  price: number;
  details?: string[];
}

interface CartPreviewProps {
  items: CartItem[];
  total: number;
  productionName?: string;
  wordCount?: string;
  region?: string;
  extras?: string[];
  selectedVoiceover?: {
    name: string;
    profilePhoto?: string;
  };
}

export function CartPreview({
  items,
  total,
  productionName,
  wordCount,
  region,
  extras,
  selectedVoiceover,
}: CartPreviewProps) {
  return (
    <div
      className={`${bricolageGrotesque.variable} font-bricolage p-4 max-h-[80vh] overflow-y-auto min-w-[300px]`}
    >
      {/* Empty state */}
      {!productionName && (!items || items.length === 0) && !selectedVoiceover && (
        <div className="text-center py-8">
          <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Package className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">
            Je winkelwagen is leeg
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Selecteer een productiesoort om te beginnen
          </p>
        </div>
      )}

      {/* Production Type */}
      {productionName && (
        <div className="bg-[#fcf9f5] dark:bg-accent rounded-lg p-3 mb-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-sm text-title flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                Productiesoort
              </h3>
              <p className="text-sm text-normal mt-1">{productionName}</p>
              {wordCount && <p className="text-xs text-muted mt-1">{wordCount}</p>}
              {region && <p className="text-xs text-muted">Uitzendgebied: {region}</p>}
            </div>
            <p className="font-semibold text-sm text-title">
              €{items.find((item) => item.name === productionName)?.price || 0}
            </p>
          </div>
        </div>
      )}

      {/* Additional word/version costs */}
      {items
        .filter((item) => item.id === 'words' || item.id === 'region')
        .map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-2 border-b border-border"
          >
            <p className="text-sm text-normal">{item.name}</p>
            <p className="font-medium text-sm text-title">+€{item.price}</p>
          </div>
        ))}

      {/* Selected Voiceover */}
      {selectedVoiceover && (
        <div className="bg-[#fcf9f5] dark:bg-accent rounded-lg p-3 mb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {selectedVoiceover.profilePhoto ? (
                <Image
                  src={selectedVoiceover.profilePhoto}
                  alt={selectedVoiceover.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-xs text-title">Stemacteur</h3>
                <p className="text-sm text-normal">{selectedVoiceover.name}</p>
              </div>
            </div>
            <p className="text-xs text-muted">Inclusief</p>
          </div>
        </div>
      )}

      {/* Extras */}
      {extras && extras.length > 0 && (
        <div className="mb-3">
          <h3 className="font-semibold text-sm text-title mb-2">Extra opties</h3>
          {extras.map((extra, index) => {
            const item = items.find((i) => i.name === extra);
            return (
              <div key={index} className="flex items-center justify-between py-1">
                <p className="text-sm text-normal">{extra}</p>
                <p className="font-medium text-sm text-title">+€{item?.price || 0}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Total Summary */}
      {total > 0 && (
        <>
          <div className="border-t border-border pt-3 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Totaalprijs
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">€{total}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <Link
            href="/checkout"
            className="block w-full bg-primary text-black text-sm font-semibold py-3 rounded-full hover:bg-primary/90 transition-colors text-center"
          >
            Doorgaan naar checkout
            <ChevronRight className="inline-block w-4 h-4 ml-1" />
          </Link>
        </>
      )}

      {/* Benefits */}
      <div className="mt-4 space-y-2 border-t border-border pt-3">
        <div className="flex items-center gap-2 text-xs">
          <Clock className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="text-normal">Levering binnen 48 uur</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Shield className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="text-normal">100% tevredenheidsgarantie</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="text-normal">Professionele kwaliteit</span>
        </div>
      </div>
    </div>
  );
}
