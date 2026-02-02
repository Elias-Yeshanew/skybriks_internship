import { useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Menu as MenuIcon, Dashboard, Inventory, People, ShoppingCart, LocalShipping, Logout, Assessment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const Layout = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard', roles: ['ROLE_ADMIN', 'ROLE_ACCOUNTANT', 'ROLE_SALES_EXECUTIVE', 'ROLE_PURCHASE_MANAGER', 'ROLE_INVENTORY_MANAGER'] },
        { text: 'Products', icon: <Inventory />, path: '/products', roles: ['ROLE_ADMIN', 'ROLE_INVENTORY_MANAGER', 'ROLE_SALES_EXECUTIVE'] },
        { text: 'Customers', icon: <People />, path: '/customers', roles: ['ROLE_ADMIN', 'ROLE_SALES_EXECUTIVE'] },
        { text: 'Suppliers', icon: <LocalShipping />, path: '/suppliers', roles: ['ROLE_ADMIN', 'ROLE_PURCHASE_MANAGER'] },
        { text: 'Sales Orders', icon: <ShoppingCart />, path: '/sales', roles: ['ROLE_ADMIN', 'ROLE_SALES_EXECUTIVE'] },
        { text: 'Purchase Orders', icon: <Assessment />, path: '/purchases', roles: ['ROLE_ADMIN', 'ROLE_PURCHASE_MANAGER'] },
    ];

    const drawer = (
        <div>
            <Toolbar>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>ERP SYSTEM</Typography>
            </Toolbar>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    // Role-based visibility logic
                    user?.roles.some(role => item.roles.includes(role)) && (
                        <ListItem key={item.text} disablePadding onClick={() => navigate(item.path)}>
                            <ListItemButton>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    )
                ))}
            </List>
            <Divider />
            <ListItem disablePadding onClick={logout}>
                <ListItemButton>
                    <ListItemIcon><Logout color="error" /></ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItemButton>
            </ListItem>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton color="inherit" edge="start" sx={{ mr: 2, display: { sm: 'none' } }} onClick={() => setMobileOpen(!mobileOpen)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Control Panel - {user?.username} ({user?.roles[0]})
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }} open>
                    {drawer}
                </Drawer>
            </Box>
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: 8 }}>
                {children}
            </Box>
        </Box>
    );
};

export default Layout;