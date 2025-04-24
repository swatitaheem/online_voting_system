import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Image } from 'react-bootstrap';
import { toast } from 'react-toastify';
import logo from '../logo.jpeg'

export default function Login() {
  const navigate = useNavigate();
  const [aadhaar, setAadhaar] = useState('');
  const [name, setName] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!aadhaar || !name) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/login', {
        aadhaar,
        name,
      });

      if (response.data.success) {
        toast.success('Login successful');
        console.log('Attempting to navigate to /vote');
        navigate('/vote');
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Server error during login');
    }
  };

  return (
    <Container fluid className="min-vh-100 mt-4" style={{ backgroundColor: '#f8f9fa' }}>
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
            <h4 className="text-muted mb-4">Voter Authentication</h4>
          </div>

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-4">
              <Form.Label>
                <strong>आधार संख्या / Aadhaar Number</strong>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="XXXX-XXXX-XXXX"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
                pattern="\d{4}-\d{4}-\d{4}"
                maxLength="14"
                className="form-control-lg"
              />
              <Form.Text className="text-muted">
                Enter your 12-digit Aadhaar number with hyphens
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>
                <strong>पूरा नाम / Full Name</strong>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name as per Aadhaar card"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control-lg"
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              size="lg"
              className="w-100 mt-3"
              style={{ 
                backgroundColor: '#FF9933', 
                borderColor: '#FF9933',
                fontSize: '1.2rem'
              }}
            >
              प्रवेश करें / Login
            </Button>
          </Form>

          <div className="text-center mt-4">
            <p className="text-muted">
              For assistance, contact toll-free: 1800-111-950
            </p>
          </div>
        </Card>
      </Container>
    </Container>
  );
}
