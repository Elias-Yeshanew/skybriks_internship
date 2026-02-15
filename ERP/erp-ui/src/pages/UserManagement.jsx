import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Chip } from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import api from '../api/axiosConfig';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '', roles: [] });

    const fetchUsers = async () => {
        const res = await api.get('/users');
        setUsers(res.data);
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleSave = async () => {
        try {
            await api.post('/users/register', newUser);
            fetchUsers();
            setOpen(false);
        } catch (err) { alert("Error registering user"); }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Staff Management</Typography>
                <Button variant="contained" startIcon={<PersonAdd />} onClick={() => setOpen(true)}>Register Employee</Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Roles</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((u) => (
                            <TableRow key={u.id}>
                                <TableCell>{u.username}</TableCell>
                                <TableCell>{u.email}</TableCell>
                                <TableCell>
                                    {u.roles.map(r => <Chip key={r.name} label={r.name} size="small" sx={{ mr: 0.5 }} />)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Register New Staff Member</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Username" margin="dense" onChange={(e) => setNewUser({...newUser, username: e.target.value})} />
                    <TextField fullWidth label="Email" margin="dense" onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
                    <TextField fullWidth label="Password" type="password" margin="dense" onChange={(e) => setNewUser({...newUser, password: e.target.value})} />
                    <TextField 
                        select fullWidth label="Assign Role" margin="dense" 
                        onChange={(e) => setNewUser({...newUser, roles: [e.target.value]})}
                    >
                        <MenuItem value="sales">Sales Executive</MenuItem>
                        <MenuItem value="purchase">Purchase Manager</MenuItem>
                        <MenuItem value="inventory">Inventory Manager</MenuItem>
                        <MenuItem value="accountant">Accountant</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Register</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserManagement;