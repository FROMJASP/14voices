'use client';

import React from 'react';
import { useLocale } from '@payloadcms/ui';

interface WarningMessageProps {
  message: {
    en: string;
    nl: string;
  };
}

export const WarningMessage: React.FC<WarningMessageProps> = ({ message }) => {
  const locale = useLocale();
  const currentMessage = message[locale.code as keyof typeof message] || message.en;

  return (
    <div
      style={{
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '4px',
        padding: '12px 16px',
        marginBottom: '16px',
        color: '#856404',
        fontSize: '14px',
        lineHeight: '1.5',
      }}
    >
      ⚠️ {currentMessage}
    </div>
  );
};
