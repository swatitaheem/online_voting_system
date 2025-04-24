import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form, Image } from 'react-bootstrap';
import { toast } from 'react-toastify';
import logo from '../logo.jpeg';

const parties = [
  {
    id: 'bjp',
    name: 'Bharatiya Janata Party (BJP)',
    work: 'Digital India, Ujjwala Yojana, Make in India',
  },
  {
    id: 'inc',
    name: 'Indian National Congress (INC)',
    work: 'RTI Act, MNREGA, National Food Security Act',
  },
  {
    id: 'aap',
    name: 'Aam Aadmi Party (AAP)',
    work: 'Free electricity, Education reform',
  },
  {
    id: 'sp',
    name: 'Bahujan Samaj Party (BSP)',
    work: 'Rural development, Infrastructure',
  },
];

export default function Vote() {
  const [aadhaar, setAadhaar] = useState('');
  const [name, setName] = useState('');
  const [selectedParty, setSelectedParty] = useState(null);  

  const handleVote = async () => {
    try {
      if (!aadhaar || !selectedParty) {
        toast.error('Please fill all required fields');
        return;
      }
      if (!/^\d{12}$/.test(aadhaar)) {
        toast.error('Please enter a valid 12-digit Aadhaar number');
        return;
      }
  
      const response = await axios.post('http://localhost:5000/vote', {
        aadhaar: aadhaar,
        party: selectedParty.id 
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.data.success) {
        toast.success('Vote recorded successfully!');
        // Clear form
        setAadhaar('');
        setSelectedParty(null);
        setName('');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error submitting vote';
      toast.error(errorMessage);
      console.error('Voting error:', error.response?.data);
    }
  };

  return (
    <Container fluid className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <Container className="py-5">
        <Card className="p-4 shadow-lg mb-5" style={{ borderRadius: '15px' }}>
          <div className="text-center mb-4">
            <Image 
              src={logo} 
              alt="Election Commission of India"
              height="80"
              className="mb-3"
            />
            <h2 className="text-primary">भारत निर्वाचन आयोग</h2>
            <h3 className="text-secondary">Election Commission of India</h3>
            <h4 className="text-muted mb-4">मतदान प्रणाली / Voting System</h4>
          </div>

          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    <strong>आधार संख्या / Aadhaar Number</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value)}
                    placeholder="XXXX-XXXX-XXXX"
                    pattern="\d{4}-\d{4}-\d{4}"
                    maxLength="14"
                    className="form-control-lg"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    <strong>पूरा नाम / Full Name</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name as per Aadhaar card"
                    className="form-control-lg"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card>

        <h5 className="text-center mb-4 text-secondary">उम्मीदवार चुनें / Select Your Candidate</h5>
        
        <Row>
          {parties.map((party, idx) => (
            <Col md={6} lg={3} className="mb-4" key={idx}>
              <Card
                className={`h-100 shadow-sm ${
                  selectedParty?.id === party.id ? 'border-success border-2' : ''
                }`}
                style={{ borderRadius: '10px' }}
              >
                <Card.Body className="text-center">
                  <Card.Title className="mb-3">{party.name}</Card.Title>
                  <Card.Text className="text-muted mb-4">{party.work}</Card.Text>
                  <Button
                    variant={selectedParty?.id === party.id ? 'success' : 'outline-success'}
                    onClick={() => setSelectedParty(party)}
                    className="w-100"
                    style={{ 
                      backgroundColor: selectedParty?.id === party.id ? '#138808' : 'white',
                      borderColor: '#138808'
                    }}
                  >
                    {selectedParty?.id === party.id ? '✓ चयनित / Selected' : 'चयन करें / Select'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="text-center mt-5">
          <Button
            variant="primary"
            size="lg"
            onClick={handleVote}
            disabled={!selectedParty}
            style={{ 
              backgroundColor: '#FF9933', 
              borderColor: '#FF9933',
              fontSize: '1.2rem',
              padding: '0.75rem 3rem'
            }}
          >
            मतदान करें / Cast Vote
          </Button>

          <div className="mt-4">
            <p className="text-muted">
              For assistance, contact toll-free: 1800-111-950
            </p>
          </div>
        </div>
      </Container>
    </Container>
  );
}
