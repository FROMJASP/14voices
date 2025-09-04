import type { CollectionConfig } from 'payload';

const SecurityLogs: CollectionConfig = {
  slug: 'security-logs',
  admin: {
    useAsTitle: 'type',
    defaultColumns: ['type', 'severity', 'userId', 'ipAddress', 'timestamp'],
    listSearchableFields: ['type', 'userId', 'ipAddress', 'details'],
    group: {
      en: 'System',
      nl: 'Systeem',
    },
    pagination: {
      defaultLimit: 50,
      limits: [25, 50, 100, 200],
    },
    description: 'Security event logs for monitoring and auditing',
    hidden: ({ user }) => user?.role !== 'admin',
  },
  access: {
    read: ({ req: { user } }) => user?.role === 'admin',
    create: () => true, // Allow system to create logs
    update: () => false, // Logs should be immutable
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Authentication Failure', value: 'auth_failure' },
        { label: 'Suspicious Activity', value: 'suspicious_activity' },
        { label: 'Rate Limit Exceeded', value: 'rate_limit_exceeded' },
        { label: 'Invalid Input', value: 'invalid_input' },
        { label: 'File Threat', value: 'file_threat' },
      ],
      admin: {
        components: {
          Cell: './components/admin/cells/SecurityEventTypeCell#SecurityEventTypeCell',
        },
      },
    },
    {
      name: 'severity',
      type: 'select',
      required: true,
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Critical', value: 'critical' },
      ],
      admin: {
        components: {
          Cell: './components/admin/cells/SeverityCell#SeverityCell',
        },
      },
    },
    {
      name: 'userId',
      type: 'text',
      admin: {
        description: 'User ID associated with the event',
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      admin: {
        description: 'IP address of the request',
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: {
        description: 'User agent string',
      },
    },
    {
      name: 'path',
      type: 'text',
      admin: {
        description: 'Request path',
      },
    },
    {
      name: 'method',
      type: 'text',
      admin: {
        description: 'HTTP method',
      },
    },
    {
      name: 'details',
      type: 'json',
      admin: {
        description: 'Additional event details',
      },
    },
    {
      name: 'timestamp',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: {
          displayFormat: 'yyyy-MM-dd HH:mm:ss',
        },
      },
    },
    {
      name: 'resolved',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether this security event has been reviewed and resolved',
      },
    },
    {
      name: 'resolvedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Admin who resolved this event',
        condition: (data) => data?.resolved === true,
      },
    },
    {
      name: 'resolvedAt',
      type: 'date',
      admin: {
        description: 'When this event was resolved',
        condition: (data) => data?.resolved === true,
        date: {
          displayFormat: 'yyyy-MM-dd HH:mm:ss',
        },
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Admin notes about this event',
        rows: 3,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Prevent updates to critical fields
        if (operation === 'update') {
          delete data.type;
          delete data.severity;
          delete data.timestamp;
          delete data.userId;
          delete data.ipAddress;
          delete data.details;
        }
        return data;
      },
    ],
  },
  indexes: [
    {
      fields: ['type', 'timestamp'],
    },
    {
      fields: ['severity', 'resolved'],
    },
    {
      fields: ['userId'],
    },
    {
      fields: ['ipAddress'],
    },
    {
      fields: ['timestamp'],
    },
  ],
};

export default SecurityLogs;
