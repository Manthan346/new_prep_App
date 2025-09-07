import React, { useState } from 'react';
import { announcementsAPI } from '../../services/api';

export default function AdminAnnouncementForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState('general');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await announcementsAPI.create({ title, body, type });
      setTitle(''); setBody(''); setType('general');
      onCreated && onCreated(res.data.announcement);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-medium mb-2">Post Announcement</h3>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full mb-2 p-2 border" required />
      <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Body" className="w-full mb-2 p-2 border" rows={4} required />
      <select value={type} onChange={e=>setType(e.target.value)} className="mb-2 p-2 border">
        <option value="general">General</option>
        <option value="job">Job</option>
        <option value="notice">Notice</option>
      </select>
      <div>
        <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Posting...' : 'Post'}</button>
      </div>
    </form>
  );
}
