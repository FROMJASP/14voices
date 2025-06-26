'use client'

import { useState } from 'react'
import { useUploadThing } from '@/lib/uploadthing'
import { Upload, FileText, X, Loader2 } from 'lucide-react'

interface ScriptUploadProps {
  bookingId: string
  onUploadComplete?: (scriptId: string) => void
  onError?: (error: string) => void
}

export function ScriptUpload({ bookingId, onUploadComplete, onError }: ScriptUploadProps) {
  const [uploadType, setUploadType] = useState<'file' | 'text'>('file')
  const [textContent, setTextContent] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const { startUpload } = useUploadThing('bookingScript', {
    onClientUploadComplete: (res) => {
      setIsUploading(false)
      setSelectedFile(null)
      setTextContent('')
      if (res?.[0] && onUploadComplete) {
        onUploadComplete(res[0].key)
      }
    },
    onUploadError: (error) => {
      setIsUploading(false)
      if (onError) {
        onError(error.message)
      }
    },
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleSubmit = async () => {
    if (uploadType === 'file' && selectedFile) {
      setIsUploading(true)
      await startUpload([selectedFile], {
        bookingId,
        scriptType: 'file',
      })
    } else if (uploadType === 'text' && textContent.trim()) {
      setIsUploading(true)
      const textBlob = new Blob([textContent], { type: 'text/plain' })
      const textFile = new File([textBlob], 'script.txt', { type: 'text/plain' })
      await startUpload([textFile], {
        bookingId,
        scriptType: 'text',
        scriptContent: textContent,
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setUploadType('file')}
          className={`px-4 py-2 rounded-md transition-colors ${
            uploadType === 'file'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Upload className="inline-block w-4 h-4 mr-2" />
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setUploadType('text')}
          className={`px-4 py-2 rounded-md transition-colors ${
            uploadType === 'text'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <FileText className="inline-block w-4 h-4 mr-2" />
          Paste Text
        </button>
      </div>

      {uploadType === 'file' ? (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.txt,.rtf"
              className="hidden"
              id="script-file-input"
              disabled={isUploading}
            />
            <label
              htmlFor="script-file-input"
              className="cursor-pointer block"
            >
              {selectedFile ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{selectedFile.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      setSelectedFile(null)
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Click to upload your script (PDF, DOC, DOCX, TXT, RTF)
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum file size: 16MB
                  </p>
                </>
              )}
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Paste your script here..."
            className="w-full h-64 p-4 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isUploading}
          />
          <p className="text-xs text-gray-500">
            Maximum text length: 100,000 characters
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={
          isUploading ||
          (uploadType === 'file' && !selectedFile) ||
          (uploadType === 'text' && !textContent.trim())
        }
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isUploading ? (
          <>
            <Loader2 className="inline-block w-4 h-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          'Upload Script'
        )}
      </button>
    </div>
  )
}