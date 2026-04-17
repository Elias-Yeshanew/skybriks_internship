import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';

const Leads = () => {
    const [leads, setLeads] = useState([]);
    const [users, setUsers] = useState([]);
    const [newLead, setNewLead] = useState({ name: '', contactInfo: '', source: 'Web', status: 'New', assignedTo: null });
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [filterStatus, setFilterStatus] = useState('All');
    const userRole = localStorage.getItem('userRole');

    const fetchLeads = async () => {
        try {
            const response = await api.get('/leads');
            setLeads(response.data.content || []);
        } catch (error) {
            console.error("Error fetching leads", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users", error);
        }
    };

    useEffect(() => {
        fetchLeads();
        fetchUsers();
    }, []);

    const handleAddLead = async (e) => {
        e.preventDefault();
        try {
            await api.post('/leads', newLead);
            setNewLead({ name: '', contactInfo: '', source: 'Web', status: 'New', assignedTo: null });
            fetchLeads();
        } catch (error) {
            console.error("Error adding lead", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/leads/${id}`);
            fetchLeads();
        } catch (error) {
            console.error("Error deleting lead", error);
        }
    };

    const handleEdit = (lead) => {
        setEditingId(lead.id);
        setEditData({ ...lead, assignedTo: lead.assignedTo ? { id: lead.assignedTo.id } : null });
    };

    const handleSaveEdit = async () => {
        try {
            await api.put(`/leads/${editingId}`, editData);
            setEditingId(null);
            fetchLeads();
        } catch (error) {
            console.error("Error updating lead", error);
        }
    };

    const filteredLeads = filterStatus === 'All' ? leads : leads.filter(l => l.status === filterStatus);

    return (
        <Layout>
            <h2>Lead Management</h2>

            <form onSubmit={handleAddLead} style={{ marginBottom: '20px', background: 'white', padding: '15px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <h4>Add New Lead</h4>
                <div style={{ width: '100%', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input type="text" placeholder="Name" value={newLead.name} onChange={e => setNewLead({ ...newLead, name: e.target.value })} required />
                    <input type="text" placeholder="Contact Info" value={newLead.contactInfo} onChange={e => setNewLead({ ...newLead, contactInfo: e.target.value })} required />
                    <select value={newLead.source} onChange={e => setNewLead({ ...newLead, source: e.target.value })} style={{ padding: '2px' }}>
                        <option value="Web">Web</option>
                        <option value="Referral">Referral</option>
                        <option value="Partner">Partner</option>
                        <option value="Other">Other</option>
                    </select>
                    <select value={newLead.status} onChange={e => setNewLead({ ...newLead, status: e.target.value })} style={{ padding: '2px' }}>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Lost">Lost</option>
                    </select>
                    <select value={newLead.assignedTo?.id || ''} onChange={e => setNewLead({ ...newLead, assignedTo: e.target.value ? { id: e.target.value } : null })}>
                        <option value="">Unassigned</option>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>{u.fullName} ({u.role})</option>
                        ))}
                    </select>
                    <button type="submit">Save Lead</button>
                </div>
            </form>

            <div style={{ marginBottom: '15px' }}>
                <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Filter by Status:</label>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '5px' }}>
                    <option value="All">All Leads</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Lost">Lost</option>
                </select>
            </div>

            <table style={{ width: '100%', background: 'white', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#bdc3c7' }}>
                        <th>Name</th>
                        <th>Contact Info</th>
                        <th>Source</th>
                        <th>Status</th>
                        <th>Sales Rep</th>
                        {userRole === 'ADMIN' && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {filteredLeads.map(l => (
                        <tr key={l.id} style={{ borderBottom: '1px solid #ddd' }}>
                            {editingId === l.id ? (
                                <>
                                    <td><input value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} style={{width: '90%'}}/></td>
                                    <td><input value={editData.contactInfo} onChange={e => setEditData({...editData, contactInfo: e.target.value})} style={{width: '90%'}}/></td>
                                    <td>
                                        <select value={editData.source} onChange={e => setEditData({ ...editData, source: e.target.value })}>
                                            <option value="Web">Web</option>
                                            <option value="Referral">Referral</option>
                                            <option value="Partner">Partner</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select value={editData.status} onChange={e => setEditData({ ...editData, status: e.target.value })}>
                                            <option value="New">New</option>
                                            <option value="Contacted">Contacted</option>
                                            <option value="Qualified">Qualified</option>
                                            <option value="Lost">Lost</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select value={editData.assignedTo?.id || ''} onChange={e => setEditData({ ...editData, assignedTo: e.target.value ? { id: e.target.value } : null })}>
                                            <option value="">Unassigned</option>
                                            {users.map(u => (
                                                <option key={u.id} value={u.id}>{u.fullName}</option>
                                            ))}
                                        </select>
                                    </td>
                                    {userRole === 'ADMIN' && (
                                        <td>
                                            <button onClick={handleSaveEdit} style={{marginRight: '5px', background: '#2ecc71', color: 'white', border: 'none', padding: '5px', borderRadius: '3px', cursor: 'pointer'}}>Save</button>
                                            <button onClick={() => setEditingId(null)} style={{background: '#95a5a6', color: 'white', border: 'none', padding: '5px', borderRadius: '3px', cursor: 'pointer'}}>Cancel</button>
                                        </td>
                                    )}
                                </>
                            ) : (
                                <>
                                    <td>{l.name}</td>
                                    <td>{l.contactInfo}</td>
                                    <td>{l.source}</td>
                                    <td>{l.status}</td>
                                    <td>{l.assignedTo ? l.assignedTo.fullName : 'None'}</td>
                                    {userRole === 'ADMIN' && (
                                        <td>
                                            <button onClick={() => handleEdit(l)} style={{marginRight: '5px', background: '#3498db', color: 'white', border: 'none', padding: '5px', borderRadius: '3px', cursor: 'pointer'}}>Edit</button>
                                            <button onClick={() => handleDelete(l.id)} style={{background: '#e74c3c', color: 'white', border: 'none', padding: '5px', borderRadius: '3px', cursor: 'pointer'}}>Delete</button>
                                        </td>
                                    )}
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
};

export default Leads;