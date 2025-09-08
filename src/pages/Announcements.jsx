import React, { useEffect, useState } from 'react';
import { announcementsAPI, apiUtils } from '../services/api';
import AnnouncementsList from '../components/common/AnnouncementsList';
import AdminAnnouncementForm from '../components/admin/AdminAnnouncementForm';

export default function AnnouncementsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = apiUtils.getCurrentUser();

  const handleUpdate = async (id, data) => {
    try {
      await announcementsAPI.update(id, data);
      setItems((prev) => prev.map((p) => (p._id === id ? { ...p, ...data } : p)));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleDelete = async (id) => {
    try {
      await announcementsAPI.remove(id);
      setItems((prev) => prev.filter((p) => p._id !== id));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (user?.role === 'student' && user?.department) {
        params.department = user.department;
      }
      const res = await announcementsAPI.list(params);
      setItems(res.data.announcements || []);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(()=>{ load(); }, []);

  return (
    <div className="p-4">
      <div className="max-w-3xl mx-auto">
        {user && user.role === 'admin' && (
          <div className="mb-4"><AdminAnnouncementForm onCreated={()=>load()} /></div>
        )}

        <h2 className="text-2xl font-bold mb-3">Announcements</h2>
        {loading ? <div>Loading...</div> : <AnnouncementsList items={items} onUpdate={handleUpdate} onDelete={handleDelete} currentUser={user} />}
      </div>
    </div>
  );
}
