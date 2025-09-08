import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { announcementsAPI } from '../services/api';
import { useNotification } from '../components/common/Notification';


export default function AnnouncementApplicantsPage() {
  const [applicants, setApplicants] = useState([]);
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [announcementId, setAnnouncementId] = useState('');
  const notify = useNotification();
  const location = useLocation();

  const load = async () => {
    if (!announcementId) return;
    setLoading(true);
    try {
      console.log('[Applicants] loading applicants for announcementId=', announcementId);
      
      // Fetch announcement details and applicants in parallel
      const [announcementRes, applicantsRes] = await Promise.all([
        announcementsAPI.getAnnouncementDetails(announcementId),
        announcementsAPI.getApplicants(announcementId)
      ]);
      
      console.log('announcement details=', announcementRes.data);
      console.log('[Applicants] server response', applicantsRes.data);
      
      // Set announcement details
      setAnnouncement(announcementRes.data.announcement);
      
      // prefer populated applicants, fall back to ids
      const populated = applicantsRes.data.applicants || [];
      const ids = applicantsRes.data.applicantIds || [];
      const users = applicantsRes.data.users || [];
      if (populated.length > 0) {
        setApplicants(populated);
      } else if (users.length > 0) {
        setApplicants(users);
      } else if (ids.length > 0) {
        // show placeholder objects with id only so admin can see stored ids
        setApplicants(ids.map(id => ({ _id: id, name: null, email: null, rollNumber: null })));
      } else {
        setApplicants([]);
      }
    } catch (err) {
      console.error(err);
      notify.error('Failed', 'Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('announcementId');
    if (q) setAnnouncementId(q);
  }, [location.search]);

  useEffect(() => {
    // if no announcementId in query, try to pick the latest job announcement automatically
    const tryAutoSelect = async () => {
      if (announcementId) return;
      try {
        const res = await announcementsAPI.list({ type: 'job' });
        const list = res.data.announcements || [];
        if (list.length > 0) {
          const id = list[0]._id;
          console.log('[Applicants] auto-selected announcementId=', id);
          setAnnouncementId(id);
        }
      } catch (err) {
        console.warn('[Applicants] auto-select failed', err?.response?.data || err.message || err);
      }
    };
    tryAutoSelect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (announcementId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [announcementId]);

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-3">Announcement Applicants</h2>
        
        {/* Announcement Details */}
        {announcement && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">{announcement.title}</h3>
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-medium">Job Description:</span> {announcement.body}
            </p>
            <p className="text-xs text-gray-500">
              Type: {announcement.type} • Created: {new Date(announcement.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}
        
        <div className="mb-4 flex gap-2">
          <input value={announcementId} onChange={(e) => setAnnouncementId(e.target.value)} placeholder="Announcement ID" className="rounded-md border px-3 py-2" />
          <button className="rounded-md bg-blue-600 px-3 py-2 text-white" onClick={load}>Load</button>
        </div>

        {loading ? <div>Loading...</div> : (
          <div className="space-y-2">
            {applicants.map(a => (
              <div key={a._id} className="rounded-lg border p-4 bg-white shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{a.name || 'Unknown User'}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {a.email && <span>{a.email}</span>}
                      {a.rollNumber && <span className="ml-2">• Roll: {a.rollNumber}</span>}
                    </div>
                    {announcement && (
                      <div className="mt-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        Applied for: <span className="font-medium">{announcement.title}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    Applied
                  </div>
                </div>
              </div>
            ))}
            {applicants.length === 0 && <div className="text-sm text-gray-500">No applicants</div>}
          </div>
        )}
      </div>
    </div>
  );
}
