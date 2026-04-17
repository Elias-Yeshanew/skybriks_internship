import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [users, setUsers] = useState([]);
    const [newSale, setNewSale] = useState({ 
        customer: null, amount: '', status: 'Proposal', date: '', assignedTo: null 
    });
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const userRole = localStorage.getItem('userRole');

    const fetchSales = async () => {
        try {
            const response = await api.get('/sales');
            setSales(response.data.content || []);
        } catch (error) {
            console.error("Error fetching sales", error);
        }
    };

    const fetchDropdownData = async () => {
        try {
            const [custRes, userRes] = await Promise.all([
                api.get('/customers'),
                api.get('/users')
            ]);
            setCustomers(custRes.data.content || []);
            setUsers(userRes.data || []);
        } catch (error) {
            console.error("Error fetching dropdowns", error);
        }
    };

    useEffect(() => {
        fetchSales();
        fetchDropdownData();
    }, []);

    const handleAddSale = async (e) => {
        e.preventDefault();
        try {
            await api.post('/sales', newSale);
            setNewSale({ customer: null, amount: '', status: 'Proposal', date: '', assignedTo: null });
            fetchSales();
        } catch (error) {
            console.error("Error adding sale", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/sales/${id}`);
            fetchSales();
        } catch (error) {
            console.error("Error deleting sale", error);
        }
    };

    const handleEdit = (sale) => {
        setEditingId(sale.id);
        const customerObj = sale.customer ? { id: sale.customer.id } : null;
        const assignedToObj = sale.assignedTo ? { id: sale.assignedTo.id } : null;
        setEditData({ ...sale, customer: customerObj, assignedTo: assignedToObj });
    };

    const handleSaveEdit = async () => {
        try {
            await api.put(`/sales/${editingId}`, editData);
            setEditingId(null);
            fetchSales();
        } catch (error) {
            console.error("Error updating sale", error);
        }
    };

    return (
        <Layout>
            <h2>Sales Management</h2>

            <form onSubmit={handleAddSale} style={{ marginBottom: '20px', background: 'white', padding: '15px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <h4>Add New Sale</h4>
                <div style={{ width: '100%', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <select required value={newSale.customer?.id || ''} onChange={e => setNewSale({ ...newSale, customer: e.target.value ? { id: e.target.value } : null })}>
                        <option value="">Select Customer</option>
                        {customers.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    
                    <input type="number" placeholder="Amount" value={newSale.amount} onChange={e => setNewSale({ ...newSale, amount: e.target.value })} required />
                    <input type="date" value={newSale.date} onChange={e => setNewSale({ ...newSale, date: e.target.value })} required />
                    
                    <select value={newSale.status} onChange={e => setNewSale({ ...newSale, status: e.target.value })}>
                        <option value="Proposal">Proposal</option>
                        <option value="Negotiation">Negotiation</option>
                        <option value="Closed-Won">Closed-Won</option>
                        <option value="Closed-Lost">Closed-Lost</option>
                    </select>

                    <select value={newSale.assignedTo?.id || ''} onChange={e => setNewSale({ ...newSale, assignedTo: e.target.value ? { id: e.target.value } : null })}>
                        <option value="">Assign Sales Rep</option>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>{u.fullName} ({u.role})</option>
                        ))}
                    </select>
                    
                    <button type="submit">Add Sale</button>
                </div>
            </form>

            <table style={{ width: '100%', background: 'white', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#bdc3c7' }}>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Sales Rep</th>
                        {userRole === 'ADMIN' && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {sales.map(s => (
                        <tr key={s.id} style={{ borderBottom: '1px solid #ddd' }}>
                            {editingId === s.id ? (
                                <>
                                    <td>
                                        <select value={editData.customer?.id || ''} onChange={e => setEditData({ ...editData, customer: e.target.value ? { id: e.target.value } : null })}>
                                            <option value="">Select Customer</option>
                                            {customers.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td><input type="number" value={editData.amount} onChange={e => setEditData({...editData, amount: e.target.value})} style={{width: '90%'}}/></td>
                                    <td>
                                        <select value={editData.status} onChange={e => setEditData({ ...editData, status: e.target.value })}>
                                            <option value="Proposal">Proposal</option>
                                            <option value="Negotiation">Negotiation</option>
                                            <option value="Closed-Won">Closed-Won</option>
                                            <option value="Closed-Lost">Closed-Lost</option>
                                        </select>
                                    </td>
                                    <td><input type="date" value={editData.date} onChange={e => setEditData({...editData, date: e.target.value})} style={{width: '90%'}}/></td>
                                    <td>
                                        <select value={editData.assignedTo?.id || ''} onChange={e => setEditData({ ...editData, assignedTo: e.target.value ? { id: e.target.value } : null })}>
                                            <option value="">Assign Sales Rep</option>
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
                                    <td>{s.customer ? s.customer.name : 'Unknown'}</td>
                                    <td>${s.amount}</td>
                                    <td>{s.status}</td>
                                    <td>{s.date}</td>
                                    <td>{s.assignedTo ? s.assignedTo.fullName : 'None'}</td>
                                    {userRole === 'ADMIN' && (
                                        <td>
                                            <button onClick={() => handleEdit(s)} style={{marginRight: '5px', background: '#3498db', color: 'white', border: 'none', padding: '5px', borderRadius: '3px', cursor: 'pointer'}}>Edit</button>
                                            <button onClick={() => handleDelete(s.id)} style={{background: '#e74c3c', color: 'white', border: 'none', padding: '5px', borderRadius: '3px', cursor: 'pointer'}}>Delete</button>
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

export default Sales;