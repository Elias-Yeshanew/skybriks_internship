import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [users, setUsers] = useState([]);
    const [newCustomer, setNewCustomer] = useState({ 
        name: '', email: '', phone: '', company: '', address: '', notes: '', assignedTo: null 
    });
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const userRole = localStorage.getItem('userRole');

    const fetchCustomers = async () => {
        try {
            const response = await api.get('/customers');
            setCustomers(response.data.content || []);
        } catch (error) {
            console.error("Error fetching customers", error);
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
        fetchCustomers();
        fetchUsers();
    }, []);

    const handleAddCustomer = async (e) => {
        e.preventDefault();
        try {
            await api.post('/customers', newCustomer);
            setNewCustomer({ name: '', email: '', phone: '', company: '', address: '', notes: '', assignedTo: null });
            fetchCustomers();
        } catch (error) {
            console.error("Error adding customer", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/customers/${id}`);
            fetchCustomers();
        } catch (error) {
            console.error("Error deleting customer", error);
        }
    };

    const handleEdit = (customer) => {
        setEditingId(customer.id);
        setEditData({ ...customer, assignedTo: customer.assignedTo ? { id: customer.assignedTo.id } : null });
    };

    const handleSaveEdit = async () => {
        try {
            await api.put(`/customers/${editingId}`, editData);
            setEditingId(null);
            fetchCustomers();
        } catch (error) {
            console.error("Error updating customer", error);
        }
    };

    return (
        <Layout>
            <h2>Customer Management</h2>

            {userRole === 'ADMIN' && (
                <form onSubmit={handleAddCustomer} style={{ marginBottom: '20px', background: 'white', padding: '15px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <h4>Add New Customer</h4>
                    <div style={{ width: '100%', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <input type="text" placeholder="Name" value={newCustomer.name} onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} required />
                        <input type="email" placeholder="Email" value={newCustomer.email} onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })} required />
                        <input type="text" placeholder="Phone" value={newCustomer.phone} onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })} />
                        <input type="text" placeholder="Company" value={newCustomer.company} onChange={e => setNewCustomer({ ...newCustomer, company: e.target.value })} required />
                        <input type="text" placeholder="Address" value={newCustomer.address} onChange={e => setNewCustomer({ ...newCustomer, address: e.target.value })} />
                        <input type="text" placeholder="Notes" value={newCustomer.notes} onChange={e => setNewCustomer({ ...newCustomer, notes: e.target.value })} />
                        
                        <select value={newCustomer.assignedTo?.id || ''} onChange={e => setNewCustomer({ ...newCustomer, assignedTo: e.target.value ? { id: e.target.value } : null })}>
                            <option value="">Unassigned</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.fullName} ({u.role})</option>
                            ))}
                        </select>
                        <button type="submit">Save Customer</button>
                    </div>
                </form>
            )}

            <table style={{ width: '100%', background: 'white', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#bdc3c7' }}>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Company</th>
                        <th>Address</th>
                        <th>Sales Rep</th>
                        {userRole === 'ADMIN' && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {customers.map(c => (
                        <tr key={c.id} style={{ borderBottom: '1px solid #ddd' }}>
                            {editingId === c.id ? (
                                <>
                                    <td><input value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} style={{width: '90%'}}/></td>
                                    <td><input value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})} style={{width: '90%'}}/></td>
                                    <td><input value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})} style={{width: '90%'}}/></td>
                                    <td><input value={editData.company} onChange={e => setEditData({...editData, company: e.target.value})} style={{width: '90%'}}/></td>
                                    <td><input value={editData.address} onChange={e => setEditData({...editData, address: e.target.value})} style={{width: '90%'}}/></td>
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
                                    <td>{c.name}</td>
                                    <td>{c.email}</td>
                                    <td>{c.phone}</td>
                                    <td>{c.company}</td>
                                    <td>{c.address}</td>
                                    <td>{c.assignedTo ? c.assignedTo.fullName : 'None'}</td>
                                    {userRole === 'ADMIN' && (
                                        <td>
                                            <button onClick={() => handleEdit(c)} style={{marginRight: '5px', background: '#3498db', color: 'white', border: 'none', padding: '5px', borderRadius: '3px', cursor: 'pointer'}}>Edit</button>
                                            <button onClick={() => handleDelete(c.id)} style={{background: '#e74c3c', color: 'white', border: 'none', padding: '5px', borderRadius: '3px', cursor: 'pointer'}}>Delete</button>
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

export default Customers;