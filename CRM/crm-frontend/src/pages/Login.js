import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const successMessage = location.state?.message;

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', { email, password });
            const token = response.data;

            // Decode token to get user details
            const decoded = jwtDecode(token);

            // Save to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('userRole', decoded.role);
            localStorage.setItem('userEmail', decoded.sub);

            navigate('/dashboard');
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#2c3e50' }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', width: '350px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#2c3e50' }}>CRM Login</h2>

                {successMessage && <div style={{ color: 'green', marginBottom: '15px', textAlign: 'center', fontSize: '14px', background: '#e8f8f5', padding: '10px', borderRadius: '4px' }}>{successMessage}</div>}
                {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center', fontSize: '14px' }}>{error}</div>}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ width: '100%', padding: '10px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer', marginBottom: '15px' }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <div style={{ textAlign: 'center', fontSize: '14px' }}>
                        Don't have an account? <Link to="/register" style={{ color: '#3498db', textDecoration: 'none' }}>Sign up</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;