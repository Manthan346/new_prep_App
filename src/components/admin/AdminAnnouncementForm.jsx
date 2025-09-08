import React, { useState } from 'react';
import { announcementsAPI } from '../../services/api';

export default function AdminAnnouncementForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState('general');
  const [loading, setLoading] = useState(false);

  // Department targeting
  const departments = [
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Mechanical',
    'Civil',
    'Chemical',
    'Electrical',
    'Other'
  ];
  const [isGlobal, setIsGlobal] = useState(true);
  const [targetDepartments, setTargetDepartments] = useState([]);

  const toggleDepartment = (dept) => {
    setTargetDepartments((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { title, body, type, isGlobal, targetDepartments };
      const res = await announcementsAPI.create(payload);
      setTitle(''); setBody(''); setType('general');
      setIsGlobal(true); setTargetDepartments([]);
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
      <select value={type} onChange={e=>setType(e.target.value)} className="mb-3 p-2 border">
        <option value="general">General</option>
        <option value="job">Job</option>
        <option value="notice">Notice</option>
      </select>

      {/* Department Targeting */}
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Visibility</label>
        <div className="flex items-center gap-4">
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="visibility" checked={isGlobal} onChange={()=>setIsGlobal(true)} />
            <span>All Departments</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="visibility" checked={!isGlobal} onChange={()=>setIsGlobal(false)} />
            <span>Specific Departments</span>
          </label>
        </div>
      </div>

      {!isGlobal && (
        <div className="mb-3">
          <div className="text-sm text-gray-600 mb-1">Select departments</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {departments.map((dept) => (
              <label key={dept} className="inline-flex items-center gap-2 p-2 border rounded">
                <input
                  type="checkbox"
                  checked={targetDepartments.includes(dept)}
                  onChange={() => toggleDepartment(dept)}
                />
                <span>{dept}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Posting...' : 'Post'}</button>
      </div>
    </form>
  );
}
