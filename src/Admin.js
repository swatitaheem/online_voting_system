import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Image, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from './logo.jpeg';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/admin/login', {
        username,
        password
      });

      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        toast.success('Admin login successful');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="p-4 shadow-lg w-100" style={{ maxWidth: '500px', borderRadius: '15px' }}>
          <div className="text-center mb-4">
            <Image 
              src={logo} 
              alt="Election Commission of India"
              height="80"
              className="mb-3"
            />
            <h2 className="text-primary">भारत निर्वाचन आयोग</h2>
            <h3 className="text-secondary">Election Commission of India</h3>
            <h4 className="text-muted mb-4">प्रशासन लॉगिन / Admin Login</h4>
          </div>

          <Form onSubmit={handleAdminLogin}>
            <Form.Group className="mb-4">
              <Form.Label>
                <strong>उपयोगकर्ता नाम / Username</strong>
              </Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FaUser />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control-lg"
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>
                <strong>पासवर्ड / Password</strong>
              </Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FaLock />
                </InputGroup.Text>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control-lg"
                  required
                />
                <Button 
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 mt-3"
              size="lg"
              disabled={isLoading}
              style={{ 
                backgroundColor: '#FF9933', 
                borderColor: '#FF9933',
                fontSize: '1.2rem'
              }}
            >
              {isLoading ? 'Logging in...' : 'प्रवेश करें / Login'}
            </Button>
          </Form>

          <div className="text-center mt-4">
            <p className="text-muted mb-0">
              Authorized personnel only
            </p>
            <p className="text-muted">
              For support: eci-admin@gov.in
            </p>
          </div>
        </Card>
      </Container>
    </Container>
  );
}
