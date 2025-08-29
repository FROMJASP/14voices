'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@payloadcms/ui';
import { getInitials } from '@/lib/initials';
import ThemeApplier from './ThemeApplier';
import LocaleHider from './LocaleHider';

const CustomAvatar: React.FC = () => {
  const { user } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything on server to avoid hydration issues
  if (!mounted || !user) {
    return (
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: 'var(--theme-elevation-100)',
          border: '2px solid var(--theme-elevation-150)',
        }}
      />
    );
  }

  const displayName = user.name || user.email || 'User';
  const initials = getInitials(displayName);

  // Check all possible avatar URL sources
  const avatarUrl =
    !imageError &&
    (user.image || // This is set by the addImageProperty hook
      user.avatarURL || // This is set by the resolveAvatarURL hook
      (user.avatar && typeof user.avatar === 'object' && user.avatar.url) ||
      (user.avatar && typeof user.avatar === 'object' && user.avatar.filename
        ? `/api/media/file/${user.avatar.filename}`
        : null));

  // Generate color based on name
  const getAvatarColor = () => {
    if (user.avatarColor) return user.avatarColor;
    const colors = [
      '#3b82f6',
      '#10b981',
      '#8b5cf6',
      '#f59e0b',
      '#ef4444',
      '#14b8a6',
      '#f97316',
      '#06b6d4',
    ];
    const index = displayName.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const avatarColor = getAvatarColor();

  const styles = {
    wrapper: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      overflow: 'hidden',
      border: '2px solid var(--theme-elevation-150)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: avatarColor,
      flexShrink: 0,
      cursor: 'pointer',
      transition: 'border-color 0.2s ease',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
    },
    initials: {
      fontSize: '13px',
      fontWeight: 600,
      color: 'white',
      userSelect: 'none' as const,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
    },
  };

  if (avatarUrl && !imageError) {
    return (
      <>
        <ThemeApplier />
        <LocaleHider />
        <div style={styles.wrapper}>
          <img
            src={avatarUrl}
            alt={displayName}
            style={styles.image}
            onError={() => setImageError(true)}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <ThemeApplier />
      <LocaleHider />
      <div style={styles.wrapper}>
        <span style={styles.initials}>{initials}</span>
      </div>
    </>
  );
};

export default CustomAvatar;
