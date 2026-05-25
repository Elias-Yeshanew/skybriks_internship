import React, { useEffect, useState } from 'react';
import { documentService, studentService } from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, FileText, X, Loader2, Award, FileCheck, ScrollText } from 'lucide-react';

const docTypes = [
  { value: 'BONAFIDE', label: 'Bonafide Certificate', icon: Award, color: '#6366f1' },
  { value: 'TRANSFER_CERTIFICATE', label: 'Transfer Certificate', icon: FileCheck, color: '#10b981' },
  { value: 'MARKSHEET', label: 'Marksheet', icon: ScrollText, color: '#f59e0b' },
];

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ studentId: '', documentType: 'BONAFIDE', content: '' });
  const [viewDoc, setViewDoc] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [docRes, studRes] = await Promise.all([
        documentService.getAll(),
        studentService.getAll(0, 100)
      ]);
      setDocuments(docRes.data);
      setStudents(studRes.data.content || []);
    } catch { toast.error('Failed to load documents'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const getStudentName = (id) => students.find(s => s.id === id)?.name || `ID ${id}`;
  const getDocInfo = (type) => docTypes.find(d => d.value === type) || docTypes[0];

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      const payload = { studentId: +form.studentId, content: form.content || undefined };
      if (form.documentType === 'BONAFIDE') await documentService.generateBonafide(payload);
      else if (form.documentType === 'TRANSFER_CERTIFICATE') await documentService.generateTC(payload);
      else await documentService.generateMarksheet(payload);
      toast.success('Document generated!');
      setModal(false);
      setForm({ studentId: '', documentType: 'BONAFIDE', content: '' });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Documents</h1>
          <p>{documents.length} documents generated</p>
        </div>
        <button className="btn-primary" onClick={() => setModal(true)}>
          <Plus size={16} /> Generate Document
        </button>
      </div>

      {loading ? (
        <div className="page-loading"><Loader2 size={32} className="spin" /></div>
      ) : (
        <div className="doc-grid">
          {documents.length === 0 ? (
            <div className="empty-state">
              <FileText size={48} />
              <p>No documents generated yet</p>
            </div>
          ) : documents.map(doc => {
            const info = getDocInfo(doc.documentType);
            const Icon = info.icon;
            return (
              <div key={doc.id} className="doc-card" onClick={() => setViewDoc(doc)}>
                <div className="doc-icon" style={{ background: info.color + '18', color: info.color }}>
                  <Icon size={24} />
                </div>
                <div className="doc-info">
                  <div className="doc-type">{info.label}</div>
                  <div className="doc-student">{getStudentName(doc.student?.id)}</div>
                  <div className="doc-date">{doc.issueDate || doc.createdAt?.split('T')[0]}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Generate Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Generate Document</h2>
              <button onClick={() => setModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleGenerate} className="modal-form">
              <div className="form-group">
                <label>Student *</label>
                <select value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })} required>
                  <option value="">Select student...</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.rollNumber})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Document Type *</label>
                <div className="doc-type-grid">
                  {docTypes.map(dt => (
                    <button key={dt.value} type="button"
                      className={`doc-type-btn ${form.documentType === dt.value ? 'selected' : ''}`}
                      style={form.documentType === dt.value ? { borderColor: dt.color, background: dt.color + '12' } : {}}
                      onClick={() => setForm({ ...form, documentType: dt.value })}>
                      <dt.icon size={18} style={{ color: dt.color }} />
                      {dt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Custom Content (optional)</label>
                <textarea value={form.content} rows={3} placeholder="Leave empty for auto-generated content..."
                  onChange={e => setForm({ ...form, content: e.target.value })} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Generate</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Document Modal */}
      {viewDoc && (
        <div className="modal-overlay" onClick={() => setViewDoc(null)}>
          <div className="modal modal-wide" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{getDocInfo(viewDoc.documentType).label}</h2>
              <button onClick={() => setViewDoc(null)}><X size={20} /></button>
            </div>
            <div className="doc-preview">
              <div className="doc-preview-header">
                <strong>{getStudentName(viewDoc.student?.id)}</strong>
                <span>Issued: {viewDoc.issueDate || '—'}</span>
              </div>
              <div className="doc-preview-content">{viewDoc.content}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
