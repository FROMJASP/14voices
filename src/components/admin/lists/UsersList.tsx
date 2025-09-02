'use client';

import React from 'react';
import { DefaultListView } from '@payloadcms/ui';
import type { AdminViewProps } from 'payload';

export const UsersList: React.FC<AdminViewProps> = (props) => {
  // Ensure depth is set for user queries to populate avatar relationship
  const enhancedProps = {
    ...props,
    listQueryParams: {
      ...props.listQueryParams,
      depth: 2, // Increase depth to ensure media is fully populated
    },
  };

  return <DefaultListView {...enhancedProps} />;
};
