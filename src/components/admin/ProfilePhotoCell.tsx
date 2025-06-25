import React from 'react'

export const ProfilePhotoCell: React.FC<{ data: any }> = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <span style={{ color: '#999' }}>No photo</span>
  }
  
  // Get the first photo if it exists
  const firstPhotoId = data[0]
  
  // For now, just show count - in a full implementation you'd fetch the actual image
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ 
        width: '32px', 
        height: '32px', 
        borderRadius: '50%', 
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        color: '#666'
      }}>
        📷
      </span>
      <span style={{ fontSize: '12px', color: '#666' }}>
        {data.length} photo{data.length !== 1 ? 's' : ''}
      </span>
    </div>
  )
}

export default ProfilePhotoCell