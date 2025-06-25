import React, { useEffect, useState } from 'react'
import { useField, useForm } from 'payload/components/forms'
import { TextField } from 'payload/components/fields'

const AutoFillDemoTitle: React.FC = () => {
  const { value, setValue } = useField<string>({ path: 'title' })
  const { value: voiceoverArtistId } = useField({ path: 'voiceoverArtist' })
  const { value: demoType } = useField({ path: 'demoType' })
  const [hasUserEdited, setHasUserEdited] = useState(false)
  const [voiceoverName, setVoiceoverName] = useState<string>('')
  const { initialData } = useForm()

  // Fetch voiceover name when artist is selected
  useEffect(() => {
    if (voiceoverArtistId) {
      fetch(`/api/voiceovers/${voiceoverArtistId}?depth=0`)
        .then(res => res.json())
        .then(data => {
          if (data?.name) {
            setVoiceoverName(data.name)
          }
        })
        .catch(console.error)
    }
  }, [voiceoverArtistId])

  // Auto-fill title when conditions are met
  useEffect(() => {
    // Only auto-fill if user hasn't manually edited and we're creating new
    if (!hasUserEdited && !initialData?.id && voiceoverName && demoType) {
      const currentYear = new Date().getFullYear()
      let newTitle = ''
      
      switch (demoType) {
        case 'reel':
          newTitle = `${voiceoverName} Demo Reel ${currentYear}`
          break
        case 'commercials':
          newTitle = `${voiceoverName} Demo Commercials ${currentYear}`
          break
        case 'narrations':
          newTitle = `${voiceoverName} Demo Narratief ${currentYear}`
          break
      }
      
      if (newTitle) {
        setValue(newTitle)
      }
    }
  }, [voiceoverName, demoType, hasUserEdited, setValue, initialData?.id])

  const handleChange = React.useCallback((val: string) => {
    setValue(val)
    setHasUserEdited(true)
  }, [setValue])

  return (
    <TextField
      path="title"
      name="title"
      label="Demo Title"
      required
      value={value}
      onChange={handleChange}
    />
  )
}

export default AutoFillDemoTitle