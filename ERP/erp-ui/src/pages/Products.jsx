import { useEffect, useState } from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, Button, Typography, Box, Dialog, DialogTitle, DialogContent, 
    DialogActions, TextField 
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const { user } = useAuth();
    const [newProduct, setNewProduct] = useState({
        sku: '', name: '', category: '', unitPrice: '', reorderLevel: '', currentStock: 0
    });

    // Fetch Products
    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            await api.post('/products', newProduct);
            fetchProducts(); // Refresh list
            handleClose();
            setNewProduct({ sku: '', name: '', category: '', unitPrice: '', reorderLevel: '', currentStock: 0 });
        } catch (error) {
            alert("Failed to save product. Check if SKU is unique.");
        }
    };

    // Check if user has permission to add products
    const canManage = user?.roles.includes('ROLE_ADMIN') || user?.roles.includes('ROLE_INVENTORY_MANAGER');

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Inventory Management</Typography>
                {canManage && (
                    <button 
                        className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
                        style={{ backgroundColor: '#1976d2', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}
                        onClick={handleOpen}
                    >
                        <AddIcon sx={{ mr: 1 }} /> Add Product
                    </button>
                )}
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell>SKU</TableCell>
                            <TableCell>Product Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Current Stock</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.sku}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.category}</TableCell>
                                <TableCell>${row.unitPrice}</TableCell>
                                <TableCell>{row.currentStock}</TableCell>
                                <TableCell>
                                    {row.currentStock === 0 ? (
                                        <Typography color="error" variant="caption" sx={{ fontWeight: 'bold' }}>
                                            OUT OF STOCK
                                        </Typography>
                                    ) : row.currentStock <= row.reorderLevel ? (
                                        <Typography color="warning.main" variant="caption" sx={{ fontWeight: 'bold' }}>
                                            LOW STOCK
                                        </Typography>
                                    ) : (
                                        <Typography color="success.main" variant="caption">
                                            In Stock
                                        </Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Product Dialog */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="SKU" name="sku" margin="dense" onChange={handleChange} />
                    <TextField fullWidth label="Product Name" name="name" margin="dense" onChange={handleChange} />
                    <TextField fullWidth label="Category" name="category" margin="dense" onChange={handleChange} />
                    <TextField fullWidth label="Unit Price" name="unitPrice" type="number" margin="dense" onChange={handleChange} />
                    <TextField fullWidth label="Reorder Level" name="reorderLevel" type="number" margin="dense" onChange={handleChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Save Product</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Products;