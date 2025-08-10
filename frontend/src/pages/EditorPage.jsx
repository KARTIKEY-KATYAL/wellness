import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthedApi } from '../lib/api'
import useAutosave from '../hooks/useAutosave'

export default function EditorPage() {
  const call = useAuthedApi()
  const { id } = useParams()
  const nav = useNavigate()

  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const [jsonUrl, setJsonUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Load when editing existing session
  useEffect(()=>{
    if (!id) return
    call(`/my-sessions/${id}`)
      .then((s)=>{
        setTitle(s.title || '')
        setTags((s.tags||[]).join(', '))
        setJsonUrl(s.json_file_url || '')
      })
      .catch((e)=> setError(e.message))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const doSaveDraft = async () => {
    if (!title.trim()) return
    setSaving(true)
    setMessage('')
    try {
      const s = await call('/my-sessions/save-draft', { method: 'POST', body: { id, title, tags, json_file_url: jsonUrl } })
      if (!id) nav(`/editor/${s._id}`, { replace: true })
      setMessage('Draft saved')
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  // Autosave after 5s inactivity
  useAutosave([title, tags, jsonUrl, id], 5000, () => {
    if (title.trim()) doSaveDraft()
  })

  const onPublish = async () => {
    if (!title.trim()) { setError('Title is required'); return }
    setSaving(true)
    setMessage('')
    try {
      await call('/my-sessions/publish', { method: 'POST', body: { id, title, tags, json_file_url: jsonUrl } })
      setMessage('Published')
      nav('/my-sessions')
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">{id ? 'Edit Session' : 'New Session'}</h1>
      <div className="space-y-3">
        <input className="w-full border p-2" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <input className="w-full border p-2" placeholder="Tags (comma-separated)" value={tags} onChange={(e)=>setTags(e.target.value)} />
        <input className="w-full border p-2" placeholder="JSON file URL" value={jsonUrl} onChange={(e)=>setJsonUrl(e.target.value)} />
        {message && <p className="text-green-600 text-sm">{message}</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button onClick={doSaveDraft} disabled={saving} className="bg-gray-800 text-white px-4 py-2 rounded">{saving? 'Saving...' : 'Save Draft'}</button>
          <button onClick={onPublish} disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded">Publish</button>
        </div>
      </div>
    </div>
  )
}
