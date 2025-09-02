'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useDocumentInfo, useForm, toast } from '@payloadcms/ui';

export const SaveDraftControls: React.FC = () => {
  const { id, collection } = useDocumentInfo();
  const { modified, submit, reset } = useForm();
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Manual save function
  const handleManualSave = useCallback(async () => {
    try {
      await submit({
        overrides: {
          _status: 'draft',
        },
      });
      setLastSaved(new Date());
      toast.success('Draft saved successfully');
    } catch (error) {
      toast.error('Failed to save draft');
    }
  }, [submit]);

  // Auto-save logic with debouncing
  useEffect(() => {
    if (!autoSaveEnabled || !modified) return;

    const saveTimeout = setTimeout(() => {
      handleManualSave();
    }, 30000); // Auto-save after 30 seconds of inactivity

    return () => clearTimeout(saveTimeout);
  }, [modified, autoSaveEnabled, handleManualSave]);

  return (
    <div
      className="save-draft-controls"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        backgroundColor: modified ? '#fef3c7' : '#f3f4f6',
      }}
    >
      <div style={{ fontSize: '14px' }}>
        {modified ? (
          <span style={{ color: '#d97706' }}>● Unsaved changes</span>
        ) : (
          <span style={{ color: '#10b981' }}>● All changes saved</span>
        )}
      </div>

      {lastSaved && (
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          Last saved: {lastSaved.toLocaleTimeString()}
        </div>
      )}

      <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '14px' }}>
          <input
            type="checkbox"
            checked={autoSaveEnabled}
            onChange={(e) => setAutoSaveEnabled(e.target.checked)}
          />
          Auto-save
        </label>

        <button
          onClick={handleManualSave}
          disabled={!modified}
          style={{
            padding: '0.25rem 1rem',
            borderRadius: '4px',
            border: '1px solid #d1d5db',
            backgroundColor: modified ? '#3b82f6' : '#e5e7eb',
            color: modified ? 'white' : '#9ca3af',
            cursor: modified ? 'pointer' : 'not-allowed',
            fontSize: '14px',
          }}
        >
          Save Draft
        </button>
      </div>
    </div>
  );
};

export default SaveDraftControls;
