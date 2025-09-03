'use client';

import React from 'react';
import { useTranslation } from '@payloadcms/ui';

export const EditBlocksTitle = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n?.language || 'en';

  const isNL = currentLanguage === 'nl';

  return (
    <div style={{ marginBottom: '20px', marginTop: '30px', padding: '0 24px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
        {isNL ? 'Blokken aanpassen' : 'Edit blocks'}
      </h3>
      <p style={{ fontSize: '14px', color: '#6B7280' }}>
        {isNL
          ? 'Dit zijn op maat ontworpen voorprogrammeerde blokken waarvan je de content kun wijzigen. Later volgen hier meer mogelijke designs om je website vorm te geven.'
          : 'These are custom pre-programmed blocks that you can edit the content of. More design options to shape your website will follow later.'}
      </p>
    </div>
  );
};
