import { useState } from "react";
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import api from '../api/axiosConfig';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '',
            password: ''});
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value});
    };


const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
        const response  = await api.post('/auth/signin', credentials);
        login(response.data);
        navigate('/dashboard');
    } catch(error){
        alert("Login Failed: Invalid Username or Password")
    }
};

return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10, ml:50}}>
            <Paper sx={{ p: 4, width: 400 }}>
                <Typography variant="h5" gutterBottom>ERP System Login</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField fullWidth label="Username" name="username" margin="normal" onChange={handleChange} />
                    <TextField fullWidth label="Password" name="password" type="password" margin="normal" onChange={handleChange} />
                    <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>Login</Button>
                </form>
            </Paper>
        </Box>
);

};

export default Login;