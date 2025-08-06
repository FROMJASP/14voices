'use client';

import React from 'react';

export const SecurityEventTypeCell: React.FC<{ cellData: string | unknown }> = ({ cellData }) => {
  const eventTypes: Record<string, { label: string; color: string }> = {
    login_attempt: { label: 'Login Attempt', color: 'blue' },
    login_success: { label: 'Login Success', color: 'green' },
    login_failure: { label: 'Login Failure', color: 'red' },
    password_reset: { label: 'Password Reset', color: 'orange' },
    permission_denied: { label: 'Permission Denied', color: 'red' },
    suspicious_activity: { label: 'Suspicious Activity', color: 'purple' },
  };

  const type = eventTypes[cellData as string] || { label: cellData as string, color: 'gray' };

  return (
    <span
      style={{
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor: `var(--color-${type.color}-100)`,
        color: `var(--color-${type.color}-800)`,
      }}
    >
      {type.label}
    </span>
  );
};
