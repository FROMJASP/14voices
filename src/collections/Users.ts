import type { CollectionConfig } from 'payload'
import { afterUserCreate } from '@/hooks/email-triggers'
import { generateGravatarUrl } from '@/lib/gravatar'
import { resolveAvatarURL, addImageProperty } from '@/hooks/user-avatar'

const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    depth: 1, // Ensure avatar relationship is populated
    forgotPassword: {
      generateEmailHTML: (args) => {
        const { token, user } = args || {}
        // Construct the reset URL pointing to our custom reset page
        const resetPasswordURL = `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/admin/reset-password?token=${token}`
        
        return `
          <!doctype html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Reset Your Password - Fourteen Voices</title>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
                  line-height: 1.6;
                  color: #333;
                  background-color: #f5f5f5;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  max-width: 600px;
                  margin: 40px auto;
                  background: #ffffff;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  overflow: hidden;
                }
                .header {
                  background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%);
                  color: white;
                  text-align: center;
                  padding: 40px 20px;
                }
                .logo {
                  display: inline-block;
                  width: 60px;
                  height: 60px;
                  background: rgba(255, 255, 255, 0.2);
                  border-radius: 12px;
                  font-weight: bold;
                  font-size: 24px;
                  line-height: 60px;
                  margin-bottom: 20px;
                }
                .content {
                  padding: 40px 30px;
                }
                .button {
                  display: inline-block;
                  background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%);
                  color: white;
                  text-decoration: none;
                  padding: 14px 32px;
                  border-radius: 6px;
                  font-weight: 500;
                  margin: 20px 0;
                  text-align: center;
                }
                .button:hover {
                  opacity: 0.9;
                }
                .footer {
                  text-align: center;
                  padding: 20px;
                  color: #666;
                  font-size: 14px;
                  border-top: 1px solid #eee;
                }
                .warning {
                  background: #fef3c7;
                  border: 1px solid #f59e0b;
                  color: #92400e;
                  padding: 12px;
                  border-radius: 6px;
                  margin: 20px 0;
                  font-size: 14px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo">14</div>
                  <h1 style="margin: 0; font-size: 28px; font-weight: 600;">Fourteen Voices</h1>
                  <p style="margin: 10px 0 0; opacity: 0.9;">Password Reset Request</p>
                </div>
                <div class="content">
                  <p>Hello${user.name ? ' ' + user.name : ''},</p>
                  <p>We received a request to reset your password for your Fourteen Voices admin account.</p>
                  <p>Click the button below to create a new password:</p>
                  <div style="text-align: center;">
                    <a href="${resetPasswordURL}" class="button">Reset Password</a>
                  </div>
                  <div class="warning">
                    <strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons. If you didn't request this password reset, you can safely ignore this email.
                  </div>
                  <p style="color: #666; font-size: 14px; margin-top: 30px;">
                    If the button doesn't work, copy and paste this link into your browser:<br>
                    <span style="color: #3b82f6; word-break: break-all;">${resetPasswordURL}</span>
                  </p>
                </div>
                <div class="footer">
                  <p>© 2024 IAM Studios. All rights reserved.</p>
                  <p style="font-size: 12px; color: #999;">This is an automated message. Please do not reply to this email.</p>
                </div>
              </div>
            </body>
          </html>
        `
      },
    },
  },
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user }, id }) => {
      // Allow users to update their own profile
      if (user?.id === id) return true
      // Allow admins to update any user
      return user?.role === 'admin'
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Upload a custom profile photo or leave empty to use Gravatar',
      },
    },
    {
      name: 'gravatarUrl',
      type: 'text',
      virtual: true,
      hooks: {
        afterRead: [
          ({ data }) => {
            if (data?.email) {
              return generateGravatarUrl(data.email, 200)
            }
            return null
          },
        ],
      },
      admin: {
        hidden: true,
      },
    },
    {
      name: 'avatarURL',
      type: 'text',
      virtual: true,
      hooks: {
        afterRead: [resolveAvatarURL],
      },
      admin: {
        hidden: true,
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'user',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
    {
      name: 'preferredLanguage',
      type: 'select',
      defaultValue: 'nl',
      label: 'Preferred Language',
      options: [
        { label: 'Nederlands', value: 'nl' },
        { label: 'English', value: 'en' },
      ],
      admin: {
        description: 'Your preferred language for the admin interface',
        position: 'sidebar',
      },
    },
    {
      name: 'emailPreferences',
      type: 'group',
      fields: [
        {
          name: 'unsubscribed',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'User has unsubscribed from all emails',
          },
        },
        {
          name: 'marketing',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Receive marketing emails',
          },
        },
        {
          name: 'transactional',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Receive transactional emails (bookings, invoices)',
          },
        },
        {
          name: 'updates',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Receive product updates and announcements',
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [afterUserCreate],
    afterRead: [
      async ({ doc, req }) => {
        // Ensure avatar is properly populated for the admin UI
        if (doc?.avatar && typeof doc.avatar === 'string') {
          try {
            const media = await req.payload.findByID({
              collection: 'media',
              id: doc.avatar,
              depth: 0,
            })
            if (media) {
              doc.avatar = media
            }
          } catch (error) {
            console.error('Error populating avatar:', error)
          }
        }
        return doc
      },
      addImageProperty,
    ],
  },
}

export default Users