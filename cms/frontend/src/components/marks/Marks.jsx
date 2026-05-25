import React, { useEffect, useState } from 'react';
import { marksService, studentService } from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react';

const emptyForm = { subject: '', marksObtained: '', maxMarks: '', semester: 1 };

export default function Marks() {
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [studentId, setStudentId] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [marksRes, studRes] = await Promise.all([
        marksService.getAll(),
        studentService.getAll(0, 100)
      ]);
      setMarks(marksRes.data);
      setStudents(studRes.data.content || []);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const openAdd = () => { setForm(emptyForm); setStudentId(''); setModal('add'); };
  const openEdit = (m) => {
    setForm({ subject: m.subject, marksObtained: m.marksObtained, maxMarks: m.maxMarks, semester: m.semester });
    setSelected(m);
    setModal('edit');
  };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal === 'add') {
        await marksService.add(studentId, { ...form, marksObtained: +form.marksObtained, maxMarks: +form.maxMarks });
        toast.success('Marks added!');
      } else {
        await marksService.update(selected.id, { ...form, marksObtained: +form.marksObtained, maxMarks: +form.maxMarks });
        toast.success('Marks updated!');
      }
      closeModal();
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this marks entry?')) return;
    await marksService.delete(id);
    toast.success('Deleted');
    fetchAll();
  };

  const getStudentName = (studentId) =>
    students.find(s => s.id === studentId)?.name || `ID ${studentId}`;

  const percentage = (obtained, max) => max > 0 ? Math.round((obtained / max) * 100) : 0;
  const gradeColor = (pct) => pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Marks</h1>
          <p>{marks.length} records</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <Plus size={16} /> Add Marks
        </button>
      </div>

      {loading ? (
        <div className="page-loading"><Loader2 size={32} className="spin" /></div>
      ) : (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th><th>Subject</th><th>Semester</th>
                <th>Score</th><th>Percentage</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {marks.length === 0 ? (
                <tr><td colSpan={6} className="empty-row">No marks records found</td></tr>
              ) : marks.map(m => {
                const pct = percentage(m.marksObtained, m.maxMarks);
                return (
                  <tr key={m.id}>
                    <td><strong>{getStudentName(m.student?.id)}</strong></td>
                    <td>{m.subject}</td>
                    <td>Sem {m.semester}</td>
                    <td>{m.marksObtained}/{m.maxMarks}</td>
                    <td>
                      <div className="progress-cell">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${pct}%`, background: gradeColor(pct) }} />
                        </div>
                        <span style={{ color: gradeColor(pct) }}>{pct}%</span>
                      </div>
                    </td>
                    <td className="actions">
                      <button className="icon-btn" onClick={() => openEdit(m)}><Edit2 size={15} /></button>
                      <button className="icon-btn danger" onClick={() => handleDelete(m.id)}><Trash2 size={15} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal === 'add' ? 'Add Marks' : 'Edit Marks'}</h2>
              <button onClick={closeModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              {modal === 'add' && (
                <div className="form-group">
                  <label>Student *</label>
                  <select value={studentId} onChange={e => setStudentId(e.target.value)} required>
                    <option value="">Select student...</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.rollNumber})</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="form-row">
                <div className="form-group">
                  <label>Subject *</label>
                  <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Semester *</label>
                  <select value={form.semester} onChange={e => setForm({ ...form, semester: +e.target.value })}>
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Marks Obtained *</label>
                  <input type="number" min="0" value={form.marksObtained}
                    onChange={e => setForm({ ...form, marksObtained: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Max Marks *</label>
                  <input type="number" min="1" value={form.maxMarks}
                    onChange={e => setForm({ ...form, maxMarks: e.target.value })} required />
                </div>
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
