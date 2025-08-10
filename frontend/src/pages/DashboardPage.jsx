import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function DashboardPage() {
  const [sessions, setSessions] = useState([])
  const [error, setError] = useState('')

  useEffect(()=>{
    api('/sessions')
      .then(setSessions)
      .catch((e)=> setError(e.message))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Published Sessions</h1>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <div className="grid gap-3">
        {sessions.map(s => (
          <div key={s._id} className="p-3 border rounded bg-white">
            <div className="font-medium">{s.title}</div>
            <div className="text-sm text-gray-500">{(s.tags||[]).join(', ')}</div>
            {s.json_file_url && <a className="text-blue-600 text-sm" href={s.json_file_url} target="_blank">JSON File</a>}
          </div>
        ))}
        {!sessions.length && <p className="text-sm text-gray-600">No sessions yet.</p>}
      </div>
    </div>
  )
}
