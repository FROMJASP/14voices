'use client'

import React from 'react'

const tagColors: Record<string, string> = {
  'autoriteit': '#8B5CF6',
  'jeugdig-fris': '#10B981',
  'kwaliteit': '#3B82F6',
  'stoer': '#EF4444',
  'warm-donker': '#F59E0B',
  'zakelijk': '#6B7280',
  'custom': '#EC4899',
}

export const StyleTagsCell: React.FC<{ data: any }> = ({ data }) => {
  if (!data || !Array.isArray(data)) return null
  
  const tags = data.map((item: any) => ({
    value: item.tag === 'custom' ? item.customTag : item.tag,
    type: item.tag,
  })).filter(item => item.value)
  
  if (tags.length === 0) return <span style={{ color: '#999' }}>No tags</span>
  
  return (
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {tags.map((tag, index) => (
        <span
          key={index}
          style={{
            backgroundColor: tagColors[tag.type] || '#9CA3AF',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
          }}
        >
          {tag.value}
        </span>
      ))}
    </div>
  )
}

export default StyleTagsCell