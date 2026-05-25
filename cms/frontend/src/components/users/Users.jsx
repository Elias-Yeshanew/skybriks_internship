import React, { useEffect, useState } from 'react';
import { authService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Loader2, Shield, BookOpen } from 'lucide-react';

const emptyForm = { fullName: '', email: '', password: '', role: 'TEACHER' };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await authService.getUsers();
      setUsers(res.data);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openAdd = () => { setForm(emptyForm); setModal('add'); };
  const openEdit = (u) => { setForm({ fullName: u.fullName, email: u.email, role: u.role, password: '' }); setSelected(u); setModal('edit'); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal === 'add') {
        await authService.register(form);
        toast.success('User created!');
      } else {
        await authService.updateUser(selected.id, form);
        toast.success('User updated!');
      }
      closeModal();
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (id === currentUser?.id) { toast.error("Can't delete yourself"); return; }
    if (!window.confirm('Delete this user?')) return;
    await authService.deleteUser(id);
    toast.success('User deleted');
    fetchUsers();
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>User Management</h1>
          <p>{users.length} users registered</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <Plus size={16} /> Add User
        </button>
      </div>

      {loading ? (
        <div className="page-loading"><Loader2 size={32} className="spin" /></div>
      ) : (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Created</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar-sm">{u.fullName?.[0]?.toUpperCase()}</div>
                      <strong>{u.fullName}</strong>
                      {u.email === currentUser?.email && <span className="you-badge">You</span>}
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`role-badge ${u.role === 'ADMIN' ? 'admin' : 'teacher'}`}>
                      {u.role === 'ADMIN' ? <Shield size={12} /> : <BookOpen size={12} />}
                      {u.role}
                    </span>
                  </td>
                  <td>{u.createdAt?.split('T')[0] || '—'}</td>
                  <td className="actions">
                    <button className="icon-btn" onClick={() => openEdit(u)}><Edit2 size={15} /></button>
                    <button className="icon-btn danger" onClick={() => handleDelete(u.id)}><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal === 'add' ? 'Add User' : 'Edit User'}</h2>
              <button onClick={closeModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>{modal === 'add' ? 'Password *' : 'New Password (leave blank to keep)'}</label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  required={modal === 'add'} />
              </div>
              <div className="form-group">
                <label>Role *</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option value="TEACHER">Teacher</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
