'use client';

import React from 'react';
import type { DefaultCellComponentProps } from 'payload';

export const PhoneCell: React.FC<DefaultCellComponentProps> = ({ cellData }) => {
  return <span>{cellData || '-'}</span>;
};
