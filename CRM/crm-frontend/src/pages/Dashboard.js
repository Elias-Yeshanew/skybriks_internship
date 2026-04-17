import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        customers: 0,
        leads: 0,
        openTasks: 0,
        salesAmount: 0
    });

    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch all data simultaneously
                const [customersRes, leadsRes, tasksRes, salesRes] = await Promise.all([
                    api.get('/customers'),
                    api.get('/leads'),
                    api.get('/tasks'),
                    api.get('/sales')
                ]);

                // Calculate metrics
                const totalCustomers = customersRes.data.totalElements;
                const totalLeads = leadsRes.data.totalElements;
                const openTasksCount = tasksRes.data.content.filter(task => task.status !== 'Completed').length;

                // Calculate total revenue from closed-won sales
                const totalRevenue = salesRes.data.content
                    .filter(sale => sale.status === 'Closed-Won')
                    .reduce((sum, sale) => sum + (sale.amount || 0), 0);

                setStats({
                    customers: totalCustomers,
                    leads: totalLeads,
                    openTasks: openTasksCount,
                    salesAmount: totalRevenue
                });

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <Layout>
            <div style={{ padding: '20px' }}>
                <h2 style={{ marginBottom: '30px' }}>Welcome to the CRM Dashboard</h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                    {/* Customers Card */}
                    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ color: '#2980b9', marginBottom: '10px' }}>Total Customers</h3>
                        <p style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#34495e' }}>{stats.customers}</p>
                    </div>

                    {/* Leads Card */}
                    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ color: '#27ae60', marginBottom: '10px' }}>Total Leads</h3>
                        <p style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#34495e' }}>{stats.leads}</p>
                    </div>

                    {/* Open Tasks Card */}
                    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ color: '#e67e22', marginBottom: '10px' }}>Open Tasks</h3>
                        <p style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#34495e' }}>{stats.openTasks}</p>
                    </div>

                    {/* Total Revenue Card */}
                    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ color: '#2ecc71', marginBottom: '10px' }}>Total Revenue</h3>
                        <p style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#34495e' }}>${stats.salesAmount.toLocaleString()}</p>
                    </div>
                </div>

                {/* Welcome Message */}
                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Welcome, {userEmail}!</h3>
                    <p style={{ fontSize: '1.2em', color: '#555' }}>
                        You are logged in as <strong>{userRole}</strong>. Use the navigation menu to manage your customers, leads, tasks, and sales.
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;