#!/usr/bin/env node

/**
 * Reset Payload instance via health API endpoint
 * Useful for Docker deployments when database becomes available
 */

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

async function resetPayload() {
  console.log('🔄 Attempting to reset Payload instance...');

  try {
    const response = await fetch(`${API_URL}/api/health?reset=true`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Payload reset successful:', data);
    } else {
      console.error('❌ Reset failed:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
    }
  } catch (error) {
    console.error('❌ Network error during reset:', error.message);
  }
}

async function checkHealth() {
  console.log('🔍 Checking application health...');

  try {
    const response = await fetch(`${API_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('📊 Health status:', JSON.stringify(data, null, 2));
      return data;
    } else {
      console.error('❌ Health check failed:', response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error('❌ Network error during health check:', error.message);
    return null;
  }
}

async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'reset':
      await resetPayload();
      break;
    case 'status':
    case 'health':
      await checkHealth();
      break;
    default:
      console.log('Usage:');
      console.log('  node reset-payload.js reset   - Reset Payload instance');
      console.log('  node reset-payload.js status  - Check health status');
      console.log('');
      console.log('Environment variables:');
      console.log('  NEXT_PUBLIC_SERVER_URL - API base URL (default: http://localhost:3000)');
      process.exit(1);
  }
}

main().catch(console.error);
