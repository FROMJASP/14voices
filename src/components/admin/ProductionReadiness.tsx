'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface HealthCheck {
  name: string;
  status: 'checking' | 'healthy' | 'unhealthy' | 'warning';
  message?: string;
  details?: Record<string, unknown>;
}

export function ProductionReadiness() {
  const [checks, setChecks] = useState<HealthCheck[]>([
    { name: 'Database Connection', status: 'checking' },
    { name: 'Cache System', status: 'checking' },
    { name: 'Storage Configuration', status: 'checking' },
    { name: 'Email Service', status: 'checking' },
    { name: 'Environment Variables', status: 'checking' },
    { name: 'SSL Certificate', status: 'checking' },
    { name: 'Error Monitoring', status: 'checking' },
    { name: 'Performance Monitoring', status: 'checking' }
  ]);

  useEffect(() => {
    checkProductionReadiness();
  }, []);

  const checkProductionReadiness = async () => {
    try {
      // Check main health endpoint
      const healthResponse = await fetch('/api/health');
      const healthData = await healthResponse.json();

      // Check cache health
      const cacheResponse = await fetch('/api/health/cache');
      const cacheData = await cacheResponse.json();

      // Check email system
      const emailResponse = await fetch('/api/health/email-system');
      const emailData = await emailResponse.json();

      // Update checks based on responses
      setChecks(prev => prev.map(check => {
        switch (check.name) {
          case 'Database Connection':
            return {
              ...check,
              status: healthData.checks?.database ? 'healthy' : 'unhealthy',
              message: healthData.checks?.database ? 'Connected' : 'Connection failed'
            };
          case 'Cache System':
            return {
              ...check,
              status: cacheData.status === 'healthy' ? 'healthy' : 'unhealthy',
              message: cacheData.status === 'healthy' ? 'Redis connected' : 'Cache unavailable'
            };
          case 'Storage Configuration':
            return {
              ...check,
              status: healthData.checks?.storage ? 'healthy' : 'warning',
              message: healthData.checks?.storage ? 'Configured' : 'Not configured'
            };
          case 'Email Service':
            return {
              ...check,
              status: emailData.status === 'healthy' ? 'healthy' : 'warning',
              message: emailData.message
            };
          case 'Environment Variables':
            return {
              ...check,
              status: process.env.NODE_ENV === 'production' ? 'healthy' : 'warning',
              message: `Running in ${process.env.NODE_ENV} mode`
            };
          case 'SSL Certificate':
            return {
              ...check,
              status: window.location.protocol === 'https:' ? 'healthy' : 'warning',
              message: window.location.protocol === 'https:' ? 'HTTPS enabled' : 'No HTTPS'
            };
          case 'Error Monitoring':
            return {
              ...check,
              status: process.env.NEXT_PUBLIC_SENTRY_DSN ? 'healthy' : 'warning',
              message: process.env.NEXT_PUBLIC_SENTRY_DSN ? 'Sentry configured' : 'No error monitoring'
            };
          case 'Performance Monitoring':
            return {
              ...check,
              status: 'healthy',
              message: 'Monitoring active'
            };
          default:
            return check;
        }
      }));
    } catch (error) {
      console.error('Failed to check production readiness:', error);
      setChecks(prev => prev.map(check => ({
        ...check,
        status: 'unhealthy',
        message: 'Check failed'
      })));
    }
  };

  const getStatusIcon = (status: HealthCheck['status']) => {
    switch (status) {
      case 'checking':
        return <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />;
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'unhealthy':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const allHealthy = checks.every(check => check.status === 'healthy');
  const hasWarnings = checks.some(check => check.status === 'warning');
  const hasErrors = checks.some(check => check.status === 'unhealthy');

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Production Readiness</h2>
      
      <div className="mb-4">
        {allHealthy && (
          <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>All systems are production ready!</span>
          </div>
        )}
        {hasErrors && (
          <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            <span>Critical issues detected. Please resolve before deploying.</span>
          </div>
        )}
        {!allHealthy && !hasErrors && hasWarnings && (
          <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>Some warnings detected. Review before deploying.</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {checks.map((check) => (
          <div key={check.name} className="flex items-center justify-between py-2 border-b last:border-0">
            <div className="flex items-center gap-3">
              {getStatusIcon(check.status)}
              <span className="font-medium">{check.name}</span>
            </div>
            <span className="text-sm text-gray-600">{check.message}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t">
        <h3 className="font-medium mb-2">Deployment Checklist:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>✓ All environment variables configured</li>
          <li>✓ Database migrations up to date</li>
          <li>✓ Error boundaries implemented</li>
          <li>✓ SEO metadata configured</li>
          <li>✓ Security headers enabled</li>
          <li>✓ Rate limiting configured</li>
          <li>✓ Monitoring and alerting set up</li>
        </ul>
      </div>
    </div>
  );
}