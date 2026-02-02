import { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { Inventory, People, AttachMoney, ShoppingBasket, Warning, PendingActions } from '@mui/icons-material';
import api from '../api/axiosConfig';

const DashboardCard = ({ title, value, icon, color }) => (
    <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', backgroundColor: color, color: '#fff' }}>
        <Box sx={{ mr: 2 }}>{icon}</Box>
        <Box>
            <Typography variant="subtitle1">{title}</Typography>
            <Typography variant="h4" fontWeight="bold">{value}</Typography>
        </Box>
    </Paper>
);

const Dashboard = () => {
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        api.get('/dashboard/summary')
            .then(res => setSummary(res.data))
            .catch(err => console.error("Error fetching summary", err));
    }, []);

    if (!summary) return <Typography>Loading Dashboard...</Typography>;

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4 }}>Business Overview</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <DashboardCard title="Total Sales" value={`$${summary.totalSalesAmount}`} icon={<AttachMoney fontSize="large" />} color="#2e7d32" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <DashboardCard title="Total Purchases" value={`$${summary.totalPurchaseAmount}`} icon={<ShoppingBasket fontSize="large" />} color="#0288d1" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <DashboardCard title="Low Stock Items" value={summary.lowStockCount} icon={<Warning fontSize="large" />} color="#ed6c02" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <DashboardCard title="Products" value={summary.totalProducts} icon={<Inventory fontSize="large" />} color="#9c27b0" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <DashboardCard title="Customers" value={summary.totalCustomers} icon={<People fontSize="large" />} color="#757575" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <DashboardCard title="Pending POs" value={summary.pendingOrders} icon={<PendingActions fontSize="large" />} color="#d32f2f" />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;