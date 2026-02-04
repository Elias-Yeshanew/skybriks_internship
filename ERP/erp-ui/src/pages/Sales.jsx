import { useEffect, useState } from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, Button, Typography, Box, Dialog, DialogTitle, DialogContent, 
    DialogActions, TextField, MenuItem, IconButton, Grid, Divider 
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Receipt as ReceiptIcon } from '@mui/icons-material';
import api from '../api/axiosConfig';

const Sales = () => {
    const [salesOrders, setSalesOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    
    // Form State
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [orderItems, setOrderItems] = useState([{ product: '', quantity: 1, unitPrice: 0 }]);

    const fetchData = async () => {
        try {
            const [salesRes, custRes, prodRes] = await Promise.all([
                api.get('/sales/orders'),
                api.get('/customers'),
                api.get('/products')
            ]);
            setSalesOrders(salesRes.data);
            setCustomers(custRes.data);
            setProducts(prodRes.data);
        } catch (error) {
            console.error("Error fetching sales data", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddItem = () => {
        setOrderItems([...orderItems, { product: '', quantity: 1, unitPrice: 0 }]);
    };

    const handleRemoveItem = (index) => {
        const list = [...orderItems];
        list.splice(index, 1);
        setOrderItems(list);
    };

    const handleItemChange = (index, field, value) => {
        const list = [...orderItems];
        if (field === 'product') {
            const selectedProd = products.find(p => p.id === value);
            list[index][field] = selectedProd;
            list[index]['unitPrice'] = selectedProd.unitPrice; // Auto-fill price
        } else {
            list[index][field] = value;
        }
        setOrderItems(list);
    };

    const calculateTotal = () => {
        return orderItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    };

    const handleSubmit = async () => {
        const payload = {
            customer: { id: selectedCustomer },
            items: orderItems.map(item => ({
                product: { id: item.product.id },
                quantity: parseInt(item.quantity),
                unitPrice: parseFloat(item.unitPrice)
            })),
            status: 'ORDERED'
        };

        try {
            await api.post('/sales/orders', payload);
            fetchData();
            setOpen(false);
            setOrderItems([{ product: '', quantity: 1, unitPrice: 0 }]);
        } catch (error) {
            alert(error.response?.data?.message || "Error creating Sales Order. Check stock!");
        }
    };

    const downloadInvoice = async (orderId) => {
        try {
            const response = await api.get(`/sales/orders/${orderId}/pdf`, {
                responseType: 'blob',
            });

            const url = WindowSharp.URL.createObjectUurl(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice_${orderId}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            alert("Error downloading PDF");
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Sales Orders</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    New Sales Order
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Total Amount</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {salesOrders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>#SO-{order.id}</TableCell>
                                <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                <TableCell>{order.customer?.name}</TableCell>
                                <TableCell>${order.totalAmount?.toFixed(2)}</TableCell>
                                <TableCell>
                                    <span style={{ color: order.status === 'ORDERED' ? 'green' : 'orange', fontWeight: 'bold' }}>
                                        {order.status}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => downloadInvoice(order.id)}>
                                        <ReceiptIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Create Order Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Create New Sales Order</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            select
                            fullWidth
                            label="Select Customer"
                            value={selectedCustomer}
                            onChange={(e) => setSelectedCustomer(e.target.value)}
                            sx={{ mb: 3 }}
                        >
                            {customers.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                        </TextField>

                        <Typography variant="h6" gutterBottom>Products</Typography>
                        <Divider sx={{ mb: 2 }} />

                        {orderItems.map((item, index) => (
                            <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 2 }}>
                                <Grid item xs={5}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Product"
                                        value={item.product?.id || ''}
                                        onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                                    >
                                        {products.map(p => (
                                            <MenuItem key={p.id} value={p.id}>
                                                {p.name} (Stock: {p.currentStock})
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Qty"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        fullWidth
                                        disabled
                                        label="Price"
                                        value={item.unitPrice}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <IconButton color="error" onClick={() => handleRemoveItem(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}

                        <Button startIcon={<AddIcon />} onClick={handleAddItem}>Add Another Product</Button>
                        
                        <Box sx={{ mt: 3, textAlign: 'right' }}>
                            <Typography variant="h5">Total: ${calculateTotal().toFixed(2)}</Typography>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="success">Confirm Sale</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Sales;