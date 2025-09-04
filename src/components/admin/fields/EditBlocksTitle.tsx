'use client';

import React from 'react';
import { useTranslation } from '@payloadcms/ui';

export const EditBlocksTitle = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n?.language || 'en';

  const isNL = currentLanguage === 'nl';

  return (
    <div style={{ marginBottom: '20px', marginTop: '30px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
        {isNL ? 'Blokken aanpassen' : 'Edit blocks'}
      </h3>
      <p style={{ fontSize: '14px', color: '#6B7280' }}>
        {isNL
          ? 'Wijzig het ontwerp en de content van een blok door een blok uit te klappen, een variant te kiezen en de velden in te vullen.'
          : 'Change the design and the content of a block by expanding a block, pick a variant and fill in the fields.'}
      </p>
    </div>
  );
};
