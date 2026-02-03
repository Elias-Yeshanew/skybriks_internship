import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Add as AddIcon, Person as PersonIcon } from '@mui/icons-material';
import api from '../api/axiosConfig';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [open, setOpen] = useState(false);
    const [newSupplier, setNewSupplier] = useState({ name: '', email: '', phone: '', address: '', gstin: '' });

    const fetchSuppliers = async () => {
        try {
            const res = await api.get('/suppliers');
            setSuppliers(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchSuppliers(); }, []);

    const handleSave = async () => {
        try {
            await api.post('/suppliers', newSupplier);
            fetchSuppliers();
            setOpen(false);
            setNewSupplier({ name: '', email: '', phone: '', address: '', gstin: '' });
        } catch (err) { alert("Error saving supplier"); }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Supplier Directory</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Add Supplier</Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Address</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {suppliers.map((c) => (
                            <TableRow key={c.id}>
                                <TableCell sx={{ fontWeight: 'bold' }}>{c.name}</TableCell>
                                <TableCell>{c.email}</TableCell>
                                <TableCell>{c.phone}</TableCell>
                                <TableCell>{c.address}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add New Supplier</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Full Name" margin="dense" onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})} />
                    <TextField fullWidth label="Email" margin="dense" onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})} />
                    <TextField fullWidth label="Phone" margin="dense" onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})} />
                    <TextField fullWidth label="Address" margin="dense" multiline rows={2} onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Suppliers;