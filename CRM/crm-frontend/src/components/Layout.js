import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar */}
            <div style={{ width: '200px', background: '#2c3e50', color: 'white', padding: '20px' }}>
                <h2>CRM App</h2>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    <li style={{ margin: '15px 0' }}><Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link></li>
                    <li style={{ margin: '15px 0' }}><Link to="/customers" style={{ color: 'white', textDecoration: 'none' }}>Customers</Link></li>
                    <li style={{ margin: '15px 0' }}><Link to="/leads" style={{ color: 'white', textDecoration: 'none' }}>Leads</Link></li>
                    <li style={{ margin: '15px 0' }}><Link to="/sales" style={{ color: 'white', textDecoration: 'none' }}>Sales</Link></li>
                    <li style={{ margin: '15px 0' }}><Link to="/tasks" style={{ color: 'white', textDecoration: 'none' }}>Tasks</Link></li>
                </ul>
                <button onClick={handleLogout} style={{ marginTop: '50px', padding: '10px', width: '100%' }}>Logout</button>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, padding: '30px', background: '#ecf0f1', overflowY: 'auto' }}>
                {children}
            </div>
        </div>
    );
};

export default Layout;