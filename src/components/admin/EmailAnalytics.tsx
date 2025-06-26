'use client'

import React, { useEffect, useState } from 'react'
import { usePayload } from '@payloadcms/ui'

interface EmailStats {
  totalSent: number
  totalDelivered: number
  totalOpened: number
  totalClicked: number
  totalBounced: number
  openRate: number
  clickRate: number
  bounceRate: number
}

interface TemplateStats {
  templateName: string
  sent: number
  delivered: number
  opened: number
  clicked: number
  openRate: number
  clickRate: number
}

export const EmailAnalytics: React.FC = () => {
  const payload = usePayload()
  const [stats, setStats] = useState<EmailStats | null>(null)
  const [templateStats, setTemplateStats] = useState<TemplateStats[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('7d')
  
  useEffect(() => {
    fetchStats()
  }, [dateRange])
  
  const fetchStats = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/email/analytics?range=${dateRange}`)
      const data = await response.json()
      setStats(data.overall)
      setTemplateStats(data.byTemplate)
    } catch (error) {
      console.error('Failed to fetch email stats:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return <div>Loading analytics...</div>
  }
  
  if (!stats) {
    return <div>No data available</div>
  }
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <h2>Email Analytics</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="dateRange">Date Range: </label>
        <select 
          id="dateRange"
          value={dateRange} 
          onChange={(e) => setDateRange(e.target.value)}
          style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Total Sent</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{stats.totalSent}</p>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Delivered</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{stats.totalDelivered}</p>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Open Rate</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{stats.openRate.toFixed(1)}%</p>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Click Rate</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{stats.clickRate.toFixed(1)}%</p>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Bounce Rate</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: stats.bounceRate > 5 ? '#e74c3c' : '#27ae60' }}>
            {stats.bounceRate.toFixed(1)}%
          </p>
        </div>
      </div>
      
      <h3>Performance by Template</h3>
      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Template</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>Sent</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>Delivered</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>Opened</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>Open Rate</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>Clicked</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>Click Rate</th>
            </tr>
          </thead>
          <tbody>
            {templateStats.map((template, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '12px' }}>{template.templateName}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{template.sent}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{template.delivered}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{template.opened}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{template.openRate.toFixed(1)}%</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{template.clicked}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{template.clickRate.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EmailAnalytics