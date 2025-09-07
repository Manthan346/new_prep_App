import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { announcementsAPI } from '../services/api';
import { useNotification } from '../components/common/Notification';

export default function AnnouncementApplicantsPage() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [announcementId, setAnnouncementId] = useState('');
  const notify = useNotification();
  const location = useLocation();

  const load = async () => {
    if (!announcementId) return;
    setLoading(true);
    try {
  console.log('[Applicants] loading applicants for announcementId=', announcementId);
  const res = await announcementsAPI.getApplicants(announcementId);
  console.log('[Applicants] server response', res.data);
      // prefer populated applicants, fall back to ids
      const populated = res.data.applicants || [];
      const ids = res.data.applicantIds || [];
      const users = res.data.users || [];
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
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-3">Announcement Applicants</h2>
        <div className="mb-4 flex gap-2">
          <input value={announcementId} onChange={(e) => setAnnouncementId(e.target.value)} placeholder="Announcement ID" className="rounded-md border px-3 py-2" />
          <button className="rounded-md bg-blue-600 px-3 py-2 text-white" onClick={load}>Load</button>
        </div>

        {loading ? <div>Loading...</div> : (
          <div className="space-y-2">
            {applicants.map(a => (
              <div key={a._id} className="rounded-lg border p-3 bg-white">
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{a.name}</div>
                    <div className="text-xs text-gray-500">{a.email} {a.rollNumber && `• ${a.rollNumber}`}</div>
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
