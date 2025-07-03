import type { CollectionConfig } from 'payload';
import { afterUserCreate } from '@/hooks/email-triggers';
import { resolveAvatarURL, addImageProperty } from '@/hooks/user-avatar';

const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    depth: 1, // Ensure avatar relationship is populated
    forgotPassword: {
      generateEmailHTML: (args) => {
        const { token, user } = args || {};
        // Construct the reset URL pointing to our custom reset page
        const resetPasswordURL = `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/admin/reset-password?token=${token}`;

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
        `;
      },
    },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['avatar', 'name', 'role', 'status', 'department', 'lastLogin'],
    listSearchableFields: ['name', 'email', 'department', 'jobTitle'],
    group: 'System',
    pagination: {
      defaultLimit: 25,
      limits: [10, 25, 50, 100],
    },
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user }, id }) => {
      // Allow users to update their own profile
      if (user?.id === id) return true;
      // Allow admins to update any user
      return user?.role === 'admin';
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      admin: {
        components: {
          Cell: './components/admin/cells/UserInfoCell#UserInfoCell',
        },
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Upload a custom profile photo',
        components: {
          Cell: './components/admin/cells/UserAvatarCell#UserAvatarCell',
        },
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
      name: 'avatarColor',
      type: 'text',
      admin: {
        description: 'Color for default avatar when no image is uploaded',
        hidden: true,
      },
      hooks: {
        beforeChange: [
          ({ value, data }: { value?: string; data?: Record<string, unknown> }) => {
            if (!value && data?.name && typeof data.name === 'string') {
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
              const index = data.name.charCodeAt(0) % colors.length;
              return colors[index];
            }
            return value;
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Suspended', value: 'suspended' },
      ],
      admin: {
        description: 'User account status',
        components: {
          Cell: './components/admin/cells/UserStatusCell#UserStatusCell',
        },
      },
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'user',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'User', value: 'user' },
      ],
      admin: {
        components: {
          Cell: './components/admin/cells/UserRoleCell#UserRoleCell',
        },
      },
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
    {
      name: 'department',
      type: 'select',
      options: [
        { label: 'Management', value: 'management' },
        { label: 'Production', value: 'production' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Finance', value: 'finance' },
        { label: 'Support', value: 'support' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Department or team the user belongs to',
      },
    },
    {
      name: 'jobTitle',
      type: 'text',
      admin: {
        description: 'Job title or position',
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Phone number (including country code)',
      },
      validate: (value: unknown) => {
        if (!value || typeof value !== 'string') return true;
        const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
        if (!phoneRegex.test(value)) {
          return 'Please enter a valid phone number';
        }
        return true;
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: {
        description: 'Short biography or description',
        rows: 4,
      },
      maxLength: 500,
    },
    {
      name: 'timezone',
      type: 'select',
      defaultValue: 'Europe/Amsterdam',
      options: [
        { label: 'Europe/Amsterdam', value: 'Europe/Amsterdam' },
        { label: 'Europe/London', value: 'Europe/London' },
        { label: 'Europe/Paris', value: 'Europe/Paris' },
        { label: 'Europe/Berlin', value: 'Europe/Berlin' },
        { label: 'America/New_York', value: 'America/New_York' },
        { label: 'America/Chicago', value: 'America/Chicago' },
        { label: 'America/Los_Angeles', value: 'America/Los_Angeles' },
        { label: 'Asia/Tokyo', value: 'Asia/Tokyo' },
        { label: 'Asia/Shanghai', value: 'Asia/Shanghai' },
        { label: 'Australia/Sydney', value: 'Australia/Sydney' },
      ],
      admin: {
        description: 'User timezone preference',
      },
    },
    {
      name: 'socialLinks',
      type: 'group',
      admin: {
        description: 'Social media profiles',
      },
      fields: [
        {
          name: 'linkedin',
          type: 'text',
          admin: {
            placeholder: 'https://linkedin.com/in/username',
          },
        },
        {
          name: 'twitter',
          type: 'text',
          admin: {
            placeholder: 'https://twitter.com/username',
          },
        },
        {
          name: 'github',
          type: 'text',
          admin: {
            placeholder: 'https://github.com/username',
          },
        },
        {
          name: 'website',
          type: 'text',
          admin: {
            placeholder: 'https://example.com',
          },
        },
      ],
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
    {
      name: 'security',
      type: 'group',
      admin: {
        description: 'Security and authentication settings',
      },
      fields: [
        {
          name: 'lastLogin',
          type: 'date',
          admin: {
            description: 'Last successful login timestamp',
            readOnly: true,
            date: {
              displayFormat: 'dd MMM yyyy HH:mm',
            },
          },
        },
        {
          name: 'loginCount',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Total number of successful logins',
            readOnly: true,
          },
        },
        {
          name: 'twoFactorEnabled',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Two-factor authentication enabled',
          },
        },
        {
          name: 'passwordChangedAt',
          type: 'date',
          admin: {
            description: 'Last password change timestamp',
            readOnly: true,
            date: {
              displayFormat: 'dd MMM yyyy HH:mm',
            },
          },
        },
        {
          name: 'loginHistory',
          type: 'array',
          admin: {
            description: 'Recent login history',
            readOnly: true,
          },
          fields: [
            {
              name: 'timestamp',
              type: 'date',
              required: true,
            },
            {
              name: 'ipAddress',
              type: 'text',
            },
            {
              name: 'userAgent',
              type: 'text',
            },
            {
              name: 'success',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
          maxRows: 10,
        },
      ],
    },
    {
      name: 'lastLogin',
      type: 'date',
      virtual: true,
      admin: {
        description: 'Last login time',
        components: {
          Cell: './components/admin/cells/UserLastSeenCell#UserLastSeenCell',
        },
      },
      hooks: {
        afterRead: [
          ({ data }: { data?: Record<string, unknown> }) => {
            const security = data?.security as { lastLogin?: string } | undefined;
            return security?.lastLogin || data?.createdAt || null;
          },
        ],
      },
    },
    {
      name: 'notifications',
      type: 'group',
      admin: {
        description: 'Notification preferences (in-app, push, SMS)',
      },
      fields: [
        {
          name: 'inApp',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Receive in-app notifications',
          },
        },
        {
          name: 'push',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Receive push notifications',
          },
        },
        {
          name: 'sms',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Receive SMS notifications',
          },
        },
      ],
    },
    {
      name: 'metadata',
      type: 'group',
      admin: {
        description: 'Additional metadata and notes',
      },
      fields: [
        {
          name: 'tags',
          type: 'array',
          admin: {
            description: 'Tags for categorization',
          },
          fields: [
            {
              name: 'tag',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'notes',
          type: 'textarea',
          admin: {
            description: 'Private notes about this user (admin only)',
            rows: 4,
          },
          access: {
            read: ({ req: { user } }) => user?.role === 'admin',
            update: ({ req: { user } }) => user?.role === 'admin',
          },
        },
        {
          name: 'customFields',
          type: 'json',
          admin: {
            description: 'Custom fields for additional data',
          },
        },
        {
          name: 'createdBy',
          type: 'relationship',
          relationTo: 'users',
          admin: {
            description: 'User who created this account',
            readOnly: true,
          },
        },
        {
          name: 'updatedBy',
          type: 'relationship',
          relationTo: 'users',
          admin: {
            description: 'Last user who updated this account',
            readOnly: true,
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
            });
            if (media) {
              doc.avatar = media;
            }
          } catch (error) {
            console.error('Error populating avatar:', error);
          }
        }
        return doc;
      },
      addImageProperty,
    ],
  },
};

export default Users;
