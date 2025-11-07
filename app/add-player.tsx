'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AddPlayerTopbar() {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'error'|'success'>('idle');
  const [message, setMessage] = useState('');
  const router = useRouter();

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() })
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Failed');
      } else {
        setStatus('success');
        setMessage('User created');
        setUsername('');
        setTimeout(() => {
          setOpen(false);
          setStatus('idle');
          setMessage('');
          router.refresh();
        }, 400);
      }
    } catch {
      setStatus('error');
      setMessage('Network error');
    }
  }

  return (
    <>
      <div className="topbar">
        <div className="topbarLeft">
          <img src="/motionX.png" alt="MotionX" style={{height:40, width:'auto', display:'block'}} />
        </div>
        <div className="topbarRight">
          <button className="topButton" onClick={() => setOpen(true)}>Add Player</button>
        </div>
      </div>

      {open && (
        <div className="modalOverlay" role="dialog" aria-modal="true" aria-labelledby="addTitle">
          <div className="modalCard">
            <div className="modalHeader">
              <div id="addTitle" className="modalTitle">Add Player</div>
              <button className="iconButton" onClick={() => setOpen(false)} aria-label="Close">✕</button>
            </div>
            <form onSubmit={submit} className="form" style={{ marginTop: 0 }}>
              <input
                className="input"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={30}
                autoFocus
              />
              <button className="button" disabled={status==='loading'}>
                {status==='loading' ? 'Adding...' : 'Add'}
              </button>
            </form>
            {status==='error' && <div className="error" style={{ marginTop: '0.5rem' }}>{message}</div>}
            {status==='success' && <div className="success" style={{ marginTop: '0.5rem' }}>{message}</div>}
          </div>
        </div>
      )}
    </>
  );
}
