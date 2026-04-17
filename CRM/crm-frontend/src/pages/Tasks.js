import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: null });
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const userRole = localStorage.getItem('userRole');

    const fetchTasks = async () => {
        const response = await api.get('/tasks');
        setTasks(response.data.content || []);
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
        fetchTasks();
        fetchUsers();
    }, []);

    const handleAddTask = async (e) => {
        e.preventDefault();
        await api.post('/tasks', newTask);
        setNewTask({ title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: null });
        fetchTasks();
    };

    const markAsComplete = async (task) => {
        await api.put(`/tasks/${task.id}`, { ...task, status: 'Completed' });
        fetchTasks();
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/tasks/${id}`);
            fetchTasks();
        } catch (error) {
            console.error("Error deleting task", error);
        }
    };

    const handleEdit = (task) => {
        setEditingId(task.id);
        setEditData({ ...task, assignedTo: task.assignedTo ? { id: task.assignedTo.id } : null });
    };

    const handleSaveEdit = async () => {
        try {
            await api.put(`/tasks/${editingId}`, editData);
            setEditingId(null);
            fetchTasks();
        } catch (error) {
            console.error("Error updating task", error);
        }
    };

    return (
        <Layout>
            <h2>Task Management</h2>

            <form onSubmit={handleAddTask} style={{ marginBottom: '20px', background: 'white', padding: '15px' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input type="text" placeholder="Task Title" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} required />
                    <input type="text" placeholder="Description" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} />
                    <input type="date" value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} />
                    <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                    <select value={newTask.assignedTo?.id || ''} onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value ? { id: e.target.value } : null })}>
                        <option value="">Unassigned</option>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>{u.fullName}</option>
                        ))}
                    </select>
                    <button type="submit">Add Task</button>
                </div>
            </form>

            <table style={{ width: '100%', background: 'white', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#bdc3c7' }}>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Due Date</th>
                        <th>Priority</th>
                        <th>Assigned To</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(t => (
                        <tr key={t.id} style={{ borderBottom: '1px solid #ddd' }}>
                            {editingId === t.id ? (
                                <>
                                    <td><input value={editData.title} onChange={e => setEditData({...editData, title: e.target.value})} style={{width: '90%'}}/></td>
                                    <td><input value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})} style={{width: '90%'}}/></td>
                                    <td><input type="date" value={editData.dueDate} onChange={e => setEditData({...editData, dueDate: e.target.value})} style={{width: '90%'}}/></td>
                                    <td>
                                        <select value={editData.priority} onChange={e => setEditData({ ...editData, priority: e.target.value })}>
                                            <option value="High">High</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Low">Low</option>
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
                                    <td>
                                        <select value={editData.status} onChange={e => setEditData({ ...editData, status: e.target.value })}>
                                            <option value="Open">Open</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button onClick={handleSaveEdit} style={{marginRight: '5px', background: '#2ecc71', color: 'white', border: 'none', padding: '5px', borderRadius: '3px', cursor: 'pointer'}}>Save</button>
                                        <button onClick={() => setEditingId(null)} style={{background: '#95a5a6', color: 'white', border: 'none', padding: '5px', borderRadius: '3px', cursor: 'pointer'}}>Cancel</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{t.title}</td>
                                    <td>{t.description}</td>
                                    <td>{t.dueDate}</td>
                                    <td>{t.priority}</td>
                                    <td>{t.assignedTo ? t.assignedTo.fullName : 'None'}</td>
                                    <td>{t.status}</td>
                                    <td>
                                        {t.status !== 'Completed' && (
                                            <button onClick={() => markAsComplete(t)} style={{marginRight: '5px', background: '#27ae60', color: 'white', border: 'none', padding: '5px', borderRadius: '3px', cursor: 'pointer'}}>Done</button>
                                        )}
                                        <button onClick={() => handleEdit(t)} style={{marginRight: '5px', background: '#3498db', color: 'white', border: 'none', padding: '5px', borderRadius: '3px', cursor: 'pointer'}}>Edit</button>
                                        {userRole === 'ADMIN' && (
                                            <button onClick={() => handleDelete(t.id)} style={{background: '#e74c3c', color: 'white', border: 'none', padding: '5px', borderRadius: '3px', cursor: 'pointer'}}>Delete</button>
                                        )}
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
};

export default Tasks;