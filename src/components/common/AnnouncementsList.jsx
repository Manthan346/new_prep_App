import React, { useState } from 'react';
import { Megaphone, Edit3, Trash2, Save, X } from 'lucide-react';
import { announcementsAPI } from '../../services/api';
import { useNotification } from '../common/Notification';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/10">
      {children}
    </span>
  );
}

export default function AnnouncementsList({ items = [], onUpdate, onDelete, currentUser }) {
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', body: '', type: 'general' });

  const startEdit = (a) => {
    setEditingId(a._id);
    setForm({ title: a.title || '', body: a.body || '', type: a.type || 'general' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: '', body: '', type: 'general' });
  };

  const saveEdit = async (id) => {
    if (!id || !items) return;
    if (typeof onUpdate === 'function') {
      const ok = await onUpdate(id, form);
      if (ok) cancelEdit();
    }
  };
  if (!items || items.length === 0) {
    return (
      <div className="p-6 rounded-lg border border-dashed border-gray-200 bg-white/60 text-center">
        <Megaphone className="mx-auto mb-3 h-6 w-6 text-gray-400" />
        <p className="text-sm text-gray-600">No announcements yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {items.map((a) => (
        <article
          key={a._id}
          className="group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-white">
                <Megaphone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{a.title}</h3>
                <p className="mt-1 text-xs text-gray-500">{a.createdBy?.name || 'Admin'} • {new Date(a.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge>{a.type || 'general'}</Badge>
              {/* Admin controls */}
              {currentUser?.role === 'admin' && (
                <div className="ml-2 flex gap-2">
                  <button title="Edit" className="rounded-md p-1 text-gray-600 hover:bg-gray-100" onClick={()=>startEdit(a)}>
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button title="Delete" className="rounded-md p-1 text-red-600 hover:bg-red-50" onClick={()=>{ if(window.confirm('Delete this announcement?')) onDelete && onDelete(a._id); }}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                  {a.type === 'job' && (
                    <ViewApplicantsButton announcementId={a._id} />
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 text-sm leading-relaxed text-gray-700">
            {editingId === a._id ? (
              <div className="space-y-2">
                <input className="w-full rounded-md border px-3 py-2" value={form.title} onChange={(e)=>setForm(f=>({...f,title:e.target.value}))} />
                <textarea className="w-full rounded-md border px-3 py-2" value={form.body} onChange={(e)=>setForm(f=>({...f,body:e.target.value}))} />
                <div className="flex gap-2">
                  <select className="rounded-md border px-2 py-1" value={form.type} onChange={(e)=>setForm(f=>({...f,type:e.target.value}))}>
                    <option value="general">General</option>
                    <option value="job">Job</option>
                    <option value="notice">Notice</option>
                  </select>
                  <div className="ml-auto flex gap-2">
                    <button className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1 text-xs text-white" onClick={()=>saveEdit(a._id)}><Save className="h-4 w-4"/>Save</button>
                    <button className="inline-flex items-center gap-2 rounded-md border px-3 py-1 text-xs" onClick={cancelEdit}><X className="h-4 w-4"/>Cancel</button>
                  </div>
                </div>
                </div>
              ) : (
              a.body
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleDateString()}</div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-500">{a.isActive ? 'Active' : 'Inactive'}</div>
              {a.type === 'job' && currentUser?.role === 'student' && (
                <ApplyWithResumeButton announcement={a} />
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function ApplyWithResumeButton({ announcement }){
  const notify = useNotification();
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [selectedName, setSelectedName] = useState('');
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const allowedTypes = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain'];
  const maxSizeBytes = 10 * 1024 * 1024; // 10MB

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!allowedTypes.includes(f.type)) {
      notify.error('Unsupported file', 'Please upload PDF, DOC, DOCX or TXT.');
      // reset and prompt reselect
      e.target.value = '';
      setTimeout(() => fileInputRef.current?.click(), 0);
      return;
    }
    if (f.size > maxSizeBytes) {
      notify.error('File too large', 'Max size is 10MB. Please choose a smaller file.');
      e.target.value = '';
      setTimeout(() => fileInputRef.current?.click(), 0);
      return;
    }
    setSelectedName(f.name);
    setUploaded(false);
  };
  const onApply = async ()=>{
    setLoading(true);
    try{
      // ensure user is logged in (auth token present)
      const token = localStorage.getItem('token');
      if (!token) {
        notify.error('Not logged in', 'Please login as a student to apply');
        setLoading(false);
        navigate('/login');
        return;
      }

      console.log('[Announcements] Applying to announcement id:', announcement._id);
      // verify announcement exists and is a job
      const aRes = await announcementsAPI.get(announcement._id);
      const full = aRes.data.announcement || aRes.data;
      if (!full) throw new Error('Announcement not found');
      if (full.type !== 'job') {
        notify.error('Cannot apply', 'This announcement does not accept applications');
        setLoading(false);
        return;
      }

      // pick file
      const file = fileInputRef.current?.files?.[0];
      if (!file) {
        // If no file selected, open the file dialog
        fileInputRef.current?.click();
        setLoading(false);
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        notify.error('Unsupported file', 'Please upload PDF, DOC, DOCX or TXT.');
        // reset and prompt reselect
        if (fileInputRef.current) fileInputRef.current.value = '';
        setLoading(false);
        setTimeout(() => fileInputRef.current?.click(), 0);
        return;
      }
      if (file.size > maxSizeBytes) {
        notify.error('File too large', 'Max size is 10MB. Please choose a smaller file.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        setLoading(false);
        setTimeout(() => fileInputRef.current?.click(), 0);
        return;
      }

      const formData = new FormData();
      formData.append('resume', file);
      const resp = await announcementsAPI.uploadResume(announcement._id, formData);
      console.log('[Announcements] Upload resume response:', resp.data);
      setUploaded(true);
      notify.success('Resume uploaded', 'Now click Apply to submit your application');
    }catch(err){
      console.error('[Announcements] Apply error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to apply';
      notify.error('Apply failed', msg);
    }finally{ setLoading(false); }
  };
  const onSubmitApplication = async () => {
    setLoading(true);
    try{
      const token = localStorage.getItem('token');
      if (!token) {
        notify.error('Not logged in', 'Please login as a student to apply');
        setLoading(false);
        navigate('/login');
        return;
      }
      const resp = await announcementsAPI.apply(announcement._id);
      console.log('[Announcements] Submit application response:', resp.data);
      notify.success('Applied', resp.data?.message || 'Application submitted successfully');
    }catch(err){
      const msg = err.response?.data?.message || err.message || 'Failed to apply';
      notify.error('Apply failed', msg);
    }finally{ setLoading(false); }
  };
  return (
    <div className="flex items-center gap-2">
      <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={onFileChange} />
      {!uploaded ? (
        <>
          {selectedName && <span className="text-xs text-gray-600 truncate max-w-[160px]">{selectedName}</span>}
          <button disabled={loading} className="ml-2 inline-flex items-center gap-2 rounded-md bg-green-600 px-3 py-1 text-xs text-white" onClick={onApply}>
            {loading ? 'Uploading...' : (selectedName ? 'Upload Resume' : 'Choose & Upload')}
          </button>
        </>
      ) : (
        <>
          <span className="text-xs text-green-700">Resume uploaded</span>
          <button disabled={loading} className="ml-2 inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1 text-xs text-white" onClick={onSubmitApplication}>
            {loading ? 'Submitting...' : 'Apply'}
          </button>
        </>
      )}
    </div>
  );
}

function ViewApplicantsButton({ announcementId }){
  const navigate = useNavigate();
  return (
    <button title="View applicants" className="rounded-md p-1 text-blue-600 hover:bg-blue-50" onClick={()=>navigate(`/announcements/applicants?announcementId=${announcementId}`)}>
      View
    </button>
  );
}

