'use client'

import React, { useState, useCallback } from 'react'
import { useAuth, useTranslation } from '@payloadcms/ui'
import { toast } from '@payloadcms/ui'
import { generateGravatarUrl, getInitials } from '@/lib/gravatar'

const CustomAccount: React.FC = () => {
  const { user, refreshCookie } = useAuth()
  const { t } = useTranslation()
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    preferredLanguage: user?.preferredLanguage || 'nl',
  })

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      const response = await fetch(`/api/users/${user?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      await refreshCookie()
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsUpdating(false)
    }
  }, [formData, user?.id, refreshCookie])

  const handleAvatarChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/media', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload avatar')
      }

      const uploadedMedia = await response.json()
      
      const updateResponse = await fetch(`/api/users/${user?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ avatar: uploadedMedia.doc.id }),
      })

      if (!updateResponse.ok) {
        throw new Error('Failed to update avatar')
      }

      await refreshCookie()
      toast.success('Avatar updated successfully')
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.error('Failed to upload avatar')
    }
  }, [user?.id, refreshCookie])

  const removeAvatar = useCallback(async () => {
    try {
      const response = await fetch(`/api/users/${user?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ avatar: null }),
      })

      if (!response.ok) {
        throw new Error('Failed to remove avatar')
      }

      await refreshCookie()
      toast.success('Avatar removed successfully')
    } catch (error) {
      console.error('Error removing avatar:', error)
      toast.error('Failed to remove avatar')
    }
  }, [user?.id, refreshCookie])

  const avatarUrl = user?.avatar?.url || user?.gravatarUrl || null
  const displayName = user?.name || user?.email || 'User'

  return (
    <div className="account-page">
      <div className="account-header">
        <h1>My Account</h1>
      </div>

      <div className="account-content">
        <div className="account-section">
          <h2>Profile Photo</h2>
          <div className="avatar-section">
            <div className="avatar-preview">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-placeholder">
                  <span>{getInitials(displayName)}</span>
                </div>
              )}
            </div>
            
            <div className="avatar-actions">
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="avatar-upload" className="btn btn--style-primary">
                Upload Photo
              </label>
              
              {user?.avatar && (
                <button
                  onClick={removeAvatar}
                  className="btn btn--style-secondary"
                  type="button"
                >
                  Remove Photo
                </button>
              )}
              
              {!user?.avatar && user?.email && (
                <p className="avatar-info">
                  Using Gravatar linked to {user.email}
                </p>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="account-form">
          <div className="field-type">
            <label className="field-label">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="field"
            />
          </div>

          <div className="field-type">
            <label className="field-label">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="field"
              disabled
            />
          </div>

          <div className="field-type">
            <label className="field-label">
              Preferred Language
            </label>
            <select
              value={formData.preferredLanguage}
              onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
              className="field"
            >
              <option value="nl">Nederlands</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="form-submit">
            <button
              type="submit"
              className="btn btn--style-primary btn--icon-style-without-border"
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .account-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }

        .account-header {
          margin-bottom: 2rem;
        }

        .account-header h1 {
          font-size: 2rem;
          font-weight: 600;
          margin: 0;
        }

        .account-section {
          background: var(--theme-elevation-0);
          border: 1px solid var(--theme-elevation-150);
          border-radius: var(--style-radius-m);
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .account-section h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0 0 1.5rem 0;
        }

        .avatar-section {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .avatar-preview {
          flex-shrink: 0;
        }

        .avatar-image {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--theme-elevation-150);
        }

        .avatar-placeholder {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: var(--theme-elevation-100);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid var(--theme-elevation-150);
        }

        .avatar-placeholder span {
          font-size: 2.5rem;
          font-weight: 600;
          color: var(--theme-text-light);
          user-select: none;
        }

        .avatar-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .avatar-info {
          font-size: 0.875rem;
          color: var(--theme-text-light);
          margin: 0;
        }

        .account-form {
          background: var(--theme-elevation-0);
          border: 1px solid var(--theme-elevation-150);
          border-radius: var(--style-radius-m);
          padding: 2rem;
        }

        .field-type {
          margin-bottom: 1.5rem;
        }

        .field-label {
          display: block;
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: var(--theme-text);
        }

        .field {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--theme-elevation-150);
          border-radius: var(--style-radius-s);
          background: var(--theme-input-bg);
          color: var(--theme-text);
          font-size: 1rem;
        }

        .field:focus {
          outline: none;
          border-color: var(--theme-success-500);
        }

        .field:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-submit {
          margin-top: 2rem;
          display: flex;
          justify-content: flex-end;
        }

        .btn {
          padding: 0.5rem 1.5rem;
          border-radius: var(--style-radius-s);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          font-size: 1rem;
        }

        .btn--style-primary {
          background: var(--theme-success-500);
          color: white;
        }

        .btn--style-primary:hover {
          background: var(--theme-success-600);
        }

        .btn--style-secondary {
          background: var(--theme-elevation-150);
          color: var(--theme-text);
        }

        .btn--style-secondary:hover {
          background: var(--theme-elevation-200);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .avatar-section {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  )
}

export default CustomAccount