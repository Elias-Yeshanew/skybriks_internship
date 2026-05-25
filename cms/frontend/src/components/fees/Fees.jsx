import React, { useEffect, useState } from 'react';
import { feeService, studentService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Loader2, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const emptyForm = { totalAmount: '', paidAmount: '' };

const StatusBadge = ({ status }) => {
  const map = {
    PAID: { label: 'Paid', icon: CheckCircle, color: '#10b981' },
    PARTIAL: { label: 'Partial', icon: Clock, color: '#f59e0b' },
    DUE: { label: 'Due', icon: AlertCircle, color: '#f43f5e' },
  };
  const { label, icon: Icon, color } = map[status] || map.DUE;
  return (
    <span className="status-badge" style={{ color, background: color + '18' }}>
      <Icon size={13} /> {label}
    </span>
  );
};

export default function Fees() {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [studentId, setStudentId] = useState('');
  const { isAdmin } = useAuth();

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [feeRes, studRes] = await Promise.all([
        feeService.getAll(),
        studentService.getAll(0, 100)
      ]);
      setFees(feeRes.data);
      setStudents(studRes.data.content || []);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const getStudentName = (id) => students.find(s => s.id === id)?.name || `ID ${id}`;

  const openAdd = () => { setForm(emptyForm); setStudentId(''); setModal('add'); };
  const openEdit = (f) => {
    setForm({ totalAmount: f.totalAmount, paidAmount: f.paidAmount });
    setSelected(f);
    setModal('edit');
  };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal === 'add') {
        await feeService.create(studentId, { ...form, totalAmount: +form.totalAmount, paidAmount: +form.paidAmount });
        toast.success('Fee record created!');
      } else {
        await feeService.update(selected.id, { ...form, totalAmount: +form.totalAmount, paidAmount: +form.paidAmount });
        toast.success('Fee updated!');
      }
      closeModal();
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete fee record?')) return;
    await feeService.delete(id);
    toast.success('Deleted');
    fetchAll();
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Fee Management</h1>
          <p>{fees.length} fee records</p>
        </div>
        {isAdmin() && (
          <button className="btn-primary" onClick={openAdd}>
            <Plus size={16} /> Add Fee Record
          </button>
        )}
      </div>

      {loading ? (
        <div className="page-loading"><Loader2 size={32} className="spin" /></div>
      ) : (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th><th>Total</th><th>Paid</th><th>Due</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fees.length === 0 ? (
                <tr><td colSpan={6} className="empty-row">No fee records found</td></tr>
              ) : fees.map(f => (
                <tr key={f.id}>
                  <td><strong>{getStudentName(f.student?.id)}</strong></td>
                  <td>₹{f.totalAmount?.toLocaleString()}</td>
                  <td className="text-green">₹{f.paidAmount?.toLocaleString()}</td>
                  <td className="text-red">₹{f.dueAmount?.toLocaleString()}</td>
                  <td><StatusBadge status={f.paymentStatus} /></td>
                  <td className="actions">
                    <button className="icon-btn" onClick={() => openEdit(f)}><Edit2 size={15} /></button>
                    {isAdmin() && (
                      <button className="icon-btn danger" onClick={() => handleDelete(f.id)}><Trash2 size={15} /></button>
                    )}
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
              <h2>{modal === 'add' ? 'Add Fee Record' : 'Update Fee'}</h2>
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
                  <label>Total Amount (₹) *</label>
                  <input type="number" min="0" value={form.totalAmount}
                    onChange={e => setForm({ ...form, totalAmount: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Paid Amount (₹) *</label>
                  <input type="number" min="0" value={form.paidAmount}
                    onChange={e => setForm({ ...form, paidAmount: e.target.value })} required />
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
