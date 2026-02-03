import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Add as AddIcon, Person as PersonIcon } from '@mui/icons-material';
import api from '../api/axiosConfig';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [open, setOpen] = useState(false);
    const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '', address: '', gstin: '' });

    const fetchCustomers = async () => {
        try {
            const res = await api.get('/customers');
            setCustomers(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchCustomers(); }, []);

    const handleSave = async () => {
        try {
            await api.post('/customers', newCustomer);
            fetchCustomers();
            setOpen(false);
            setNewCustomer({ name: '', email: '', phone: '', address: '', gstin: '' });
        } catch (err) { alert("Error saving customer"); }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Customer Directory</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Add Customer</Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>GSTIN</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customers.map((c) => (
                            <TableRow key={c.id}>
                                <TableCell sx={{ fontWeight: 'bold' }}>{c.name}</TableCell>
                                <TableCell>{c.email}</TableCell>
                                <TableCell>{c.phone}</TableCell>
                                <TableCell>{c.address}</TableCell>
                                <TableCell>{c.gstin || 'N/A'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Full Name" margin="dense" onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})} />
                    <TextField fullWidth label="Email" margin="dense" onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})} />
                    <TextField fullWidth label="Phone" margin="dense" onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})} />
                    <TextField fullWidth label="Address" margin="dense" onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})} />
                    <TextField fullWidth label="GSTIN (Optional)" margin="dense" onChange={(e) => setNewCustomer({...newCustomer, gstin: e.target.value})} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Customers;