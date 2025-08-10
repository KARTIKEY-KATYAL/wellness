import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuthedApi } from '../lib/api'

export default function MySessionsPage() {
  const call = useAuthedApi()
  const [sessions, setSessions] = useState([])
  const [error, setError] = useState('')

  useEffect(()=>{
    call('/my-sessions')
      .then(setSessions)
      .catch((e)=> setError(e.message))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">My Sessions</h1>
        <Link to="/editor" className="bg-black text-white px-3 py-2 rounded">New Session</Link>
      </div>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <div className="grid gap-3">
        {sessions.map(s => (
          <div key={s._id} className="p-3 border rounded bg-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{s.title}</div>
                <div className="text-sm text-gray-500">{(s.tags||[]).join(', ')} • {s.status}</div>
              </div>
              <Link to={`/editor/${s._id}`} className="text-blue-600">Edit</Link>
            </div>
          </div>
        ))}
        {!sessions.length && <p className="text-sm text-gray-600">No sessions yet. Click New Session.</p>}
      </div>
    </div>
  )
}
