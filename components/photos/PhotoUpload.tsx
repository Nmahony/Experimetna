'use client'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import imageCompression from 'browser-image-compression'
import { Upload, X, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  placeId: string
  onUploadComplete?: () => void
}

export function PhotoUpload({ placeId, onUploadComplete }: Props) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const f = acceptedFiles[0]
    if (!f) return
    setPreview(URL.createObjectURL(f))
    setFile(f)
    setSuccess(false)
    setError(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  const upload = async () => {
    if (!file) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      window.location.href = '/auth/login'
      return
    }

    setUploading(true)
    setError(null)

    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      })

      const ext = file.name.split('.').pop() ?? 'jpg'
      const key = `${placeId}/${user.id}-${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('place-photos')
        .upload(key, compressed, { contentType: compressed.type })

      if (uploadError) throw uploadError

      const res = await fetch('/api/uploads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId, storageKey: key, caption: caption.trim() || null }),
      })

      if (!res.ok) throw new Error('Failed to save photo record')

      setSuccess(true)
      setFile(null)
      setPreview(null)
      setCaption('')
      onUploadComplete?.()
    } catch (err: any) {
      setError(err.message ?? 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-[#2d6a4f] bg-green-50' : 'border-gray-200 hover:border-[#2d6a4f]'
        }`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="mx-auto max-h-40 rounded-lg object-cover" />
            <button
              onClick={e => { e.stopPropagation(); setPreview(null); setFile(null) }}
              className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div>
            <Upload className="mx-auto mb-2 text-gray-400" size={24} />
            <p className="text-sm text-gray-600">Drag a photo here or click to browse</p>
            <p className="text-xs text-gray-400 mt-1">Max 10MB • Compressed automatically</p>
          </div>
        )}
      </div>

      {file && (
        <>
          <input
            type="text"
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="Add a caption (optional)"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2d6a4f]"
          />
          <button
            onClick={upload}
            disabled={uploading}
            className="w-full bg-[#2d6a4f] text-white py-2 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-[#1b4332] transition-colors"
          >
            {uploading ? 'Uploading…' : 'Upload Photo'}
          </button>
        </>
      )}

      {error && <p className="text-red-500 text-xs">{error}</p>}
      {success && (
        <p className="flex items-center gap-1 text-green-600 text-sm">
          <CheckCircle size={14} /> Photo uploaded!
        </p>
      )}
    </div>
  )
}
