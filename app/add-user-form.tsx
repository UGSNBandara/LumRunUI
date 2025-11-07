'use client';
import { useState, FormEvent } from 'react';

export default function AddUserForm() {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'error'|'success'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: FormEvent) {
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
        location.reload();
      }
    } catch (err: any) {
      setStatus('error');
      setMessage('Network error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        className="input"
        placeholder="New username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        maxLength={30}
      />
      <button className="button" disabled={status==='loading'}>
        {status==='loading' ? 'Adding...' : 'Add'}
      </button>
      {status==='error' && <div className="error">{message}</div>}
      {status==='success' && <div className="success">{message}</div>}
    </form>
  );
}
