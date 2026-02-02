import { useEffect, useState } from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, Button, Typography, Box, Dialog, DialogTitle, DialogContent, 
    DialogActions, TextField, MenuItem, IconButton, Grid, Divider, Chip 
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const Purchases = () => {
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const { user } = useAuth();
    
    // Form State for new PO
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [orderItems, setOrderItems] = useState([{ product: '', quantity: 1, unitPrice: 0 }]);

    const fetchData = async () => {
        try {
            const [poRes, suppRes, prodRes] = await Promise.all([
                api.get('/purchases/orders'),
                api.get('/suppliers'),
                api.get('/products')
            ]);
            setPurchaseOrders(poRes.data);
            setSuppliers(suppRes.data);
            setProducts(prodRes.data);
        } catch (error) {
            console.error("Error fetching purchase data", error);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAddItem = () => {
        setOrderItems([...orderItems, { product: '', quantity: 1, unitPrice: 0 }]);
    };

    const handleItemChange = (index, field, value) => {
        const list = [...orderItems];
        if (field === 'product') {
            const selectedProd = products.find(p => p.id === value);
            list[index][field] = selectedProd;
            list[index]['unitPrice'] = selectedProd.unitPrice;
        } else {
            list[index][field] = value;
        }
        setOrderItems(list);
    };

    const handleSubmitPO = async () => {
        const payload = {
            supplier: { id: selectedSupplier },
            items: orderItems.map(item => ({
                product: { id: item.product.id },
                quantity: parseInt(item.quantity),
                unitPrice: parseFloat(item.unitPrice)
            }))
        };
        try {
            await api.post('/purchases/orders', payload);
            fetchData();
            setOpen(false);
            setOrderItems([{ product: '', quantity: 1, unitPrice: 0 }]);
        } catch (error) {
            alert("Error creating Purchase Order");
        }
    };

    // THIS IS THE GRN LOGIC: Increases stock in DB
    const handleReceiveGoods = async (poId) => {
        try {
            await api.post(`/purchases/grn/${poId}?receivedBy=${user.username}`);
            alert("Goods Received! Stock updated successfully.");
            fetchData(); // Refresh list to show 'RECEIVED' status
        } catch (error) {
            alert("Failed to process GRN");
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Purchase Orders & GRN</Typography>
                <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    New Purchase Order
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell>PO ID</TableCell>
                            <TableCell>Supplier</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {purchaseOrders.map((po) => (
                            <TableRow key={po.id}>
                                <TableCell>#PO-{po.id}</TableCell>
                                <TableCell>{po.supplier?.name}</TableCell>
                                <TableCell>{new Date(po.orderDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={po.status} 
                                        color={po.status === 'RECEIVED' ? 'success' : 'warning'} 
                                        variant="outlined" 
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    {po.status === 'ORDERED' && (
                                        <Button 
                                            variant="contained" 
                                            color="success" 
                                            size="small"
                                            startIcon={<CheckCircleIcon />}
                                            onClick={() => handleReceiveGoods(po.id)}
                                        >
                                            Receive Goods (GRN)
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Create PO Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Create New Purchase Order</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            select fullWidth label="Select Supplier"
                            value={selectedSupplier}
                            onChange={(e) => setSelectedSupplier(e.target.value)}
                            sx={{ mb: 3 }}
                        >
                            {suppliers.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                        </TextField>

                        {orderItems.map((item, index) => (
                            <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 2 }}>
                                <Grid item xs={6}>
                                    <TextField
                                        select fullWidth label="Product"
                                        value={item.product?.id || ''}
                                        onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                                    >
                                        {products.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                                    </TextField>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth type="number" label="Qty to Buy"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <IconButton color="error" onClick={() => {
                                        const list = [...orderItems];
                                        list.splice(index, 1);
                                        setOrderItems(list);
                                    }}><DeleteIcon /></IconButton>
                                </Grid>
                            </Grid>
                        ))}
                        <Button startIcon={<AddIcon />} onClick={handleAddItem}>Add Item</Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmitPO} variant="contained">Place Order</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Purchases;