import React, { useEffect, useState } from 'react';
import { studentService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Plus, Search, Edit2, Trash2, Eye, X, Loader2 } from 'lucide-react';

const emptyForm = { name: '', rollNumber: '', department: '', year: 1, email: '', phone: '', address: '' };

export default function Students() {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | 'edit' | 'view'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const { isAdmin } = useAuth();

  const fetchStudents = async () => {
    setLoading(true);
    try {
      if (search.trim()) {
        const res = await studentService.search(search);
        setStudents(res.data);
        setTotal(res.data.length);
      } else {
        const res = await studentService.getAll(page, 10);
        setStudents(res.data.content);
        setTotal(res.data.totalElements);
      }
    } catch { toast.error('Failed to load students'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStudents(); }, [page, search]);

  const openAdd = () => { setForm(emptyForm); setModal('add'); };
  const openEdit = (s) => { setForm(s); setSelected(s); setModal('edit'); };
  const openView = (s) => { setSelected(s); setModal('view'); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal === 'add') {
        await studentService.create(form);
        toast.success('Student added!');
      } else {
        await studentService.update(selected.id, form);
        toast.success('Student updated!');
      }
      closeModal();
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving student');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await studentService.delete(id);
      toast.success('Student deleted');
      fetchStudents();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Students</h1>
          <p>{total} students enrolled</p>
        </div>
        {isAdmin() && (
          <button className="btn-primary" onClick={openAdd}>
            <Plus size={16} /> Add Student
          </button>
        )}
      </div>

      {/* Search */}
      <div className="search-bar">
        <Search size={16} />
        <input
          placeholder="Search by name or roll number..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
        />
        {search && <button onClick={() => setSearch('')}><X size={14} /></button>}
      </div>

      {/* Table */}
      {loading ? (
        <div className="page-loading"><Loader2 size={32} className="spin" /></div>
      ) : (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th><th>Roll No</th><th>Department</th>
                <th>Year</th><th>Email</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr><td colSpan={6} className="empty-row">No students found</td></tr>
              ) : students.map(s => (
                <tr key={s.id}>
                  <td><strong>{s.name}</strong></td>
                  <td><span className="badge">{s.rollNumber}</span></td>
                  <td>{s.department}</td>
                  <td>Year {s.year}</td>
                  <td>{s.email || '—'}</td>
                  <td className="actions">
                    <button className="icon-btn" onClick={() => openView(s)} title="View"><Eye size={15} /></button>
                    {isAdmin() && <>
                      <button className="icon-btn" onClick={() => openEdit(s)} title="Edit"><Edit2 size={15} /></button>
                      <button className="icon-btn danger" onClick={() => handleDelete(s.id)} title="Delete"><Trash2 size={15} /></button>
                    </>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!search && total > 10 && (
        <div className="pagination">
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span>Page {page + 1} of {Math.ceil(total / 10)}</span>
          <button disabled={(page + 1) * 10 >= total} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}

      {/* Modal */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal === 'add' ? 'Add Student' : 'Edit Student'}</h2>
              <button onClick={closeModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Roll Number *</label>
                  <input value={form.rollNumber} onChange={e => setForm({ ...form, rollNumber: e.target.value })} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Department *</label>
                  <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Year *</label>
                  <select value={form.year} onChange={e => setForm({ ...form, year: +e.target.value })}>
                    {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={2} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {modal === 'add' ? 'Add Student' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {modal === 'view' && selected && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Student Details</h2>
              <button onClick={closeModal}><X size={20} /></button>
            </div>
            <div className="detail-grid">
              {[
                ['Name', selected.name],
                ['Roll Number', selected.rollNumber],
                ['Department', selected.department],
                ['Year', `Year ${selected.year}`],
                ['Email', selected.email || '—'],
                ['Phone', selected.phone || '—'],
                ['Address', selected.address || '—'],
                ['Enrolled', selected.createdAt?.split('T')[0] || '—'],
              ].map(([label, value]) => (
                <div key={label} className="detail-item">
                  <span className="detail-label">{label}</span>
                  <span className="detail-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
