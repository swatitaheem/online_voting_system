import React, { useState, useEffect } from 'react';
import { Container, Card, Image, Row, Col, Badge, Spinner, Table } from 'react-bootstrap';
import { FaTrophy, FaVoteYea, FaHourglassHalf } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import logo from '../logo.jpeg';

export default function ResultPage() {
  const [loading, setLoading] = useState(true);
  const [isResultDeclared, setIsResultDeclared] = useState(false);
  const [voteData, setVoteData] = useState({});
  const [stats, setStats] = useState({
    totalVotes: 0,
    leadingParty: '',
    leadingVotes: 0
  });

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await axios.get('http://localhost:5000/results'); // Fixed endpoint URL
      if (response.data.success) {
        const votes = response.data.data.votes;
        setVoteData(votes);
        calculateStats(votes);
        setIsResultDeclared(response.data.data.isResultPublic || false); // Changed to match backend property name
      } else {
        toast.error('Failed to load results');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Election results is not published yet');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (votes) => {
    const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
    const leadingVotes = Math.max(...Object.values(votes));
    const leadingParty = Object.entries(votes).find(([_, count]) => count === leadingVotes)?.[0];
    setStats({ totalVotes, leadingParty, leadingVotes });
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

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
            <h4 className="text-muted mb-4">चुनाव परिणाम / Election Results</h4>
          </div>

          {!isResultDeclared ? (
            <div className="text-center py-5">
              <FaHourglassHalf size={50} className="text-warning mb-4" />
              <h1 className="display-4 text-primary">परिणाम प्रतीक्षित</h1>
              <h2 className="display-5 text-secondary mb-4">Results Awaited</h2>
              <p className="lead text-muted">
                "लोकतंत्र की मज़बूती में आपका योगदान"
              </p>
              <p className="lead text-muted mb-4">
                "Your contribution to strengthening democracy"
              </p>
              <Card className="p-3 shadow-sm mx-auto" style={{ maxWidth: '400px' }}>
                <p className="mb-0">
                  Results will be declared as per the Election Commission's schedule
                </p>
              </Card>
            </div>
          ) : (
            <>
              <Row className="g-4 mb-4">
                <Col md={6}>
                  <Card className="h-100 shadow-sm">
                    <Card.Body className="text-center">
                      <FaVoteYea size={40} className="text-primary mb-3" />
                      <h5>कुल वोट / Total Votes Cast</h5>
                      <h2>{stats.totalVotes.toLocaleString()}</h2>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="h-100 shadow-sm">
                    <Card.Body className="text-center">
                      <FaTrophy size={40} className="text-warning mb-3" />
                      <h5>अग्रणी दल / Leading Party</h5>
                      <h2>{stats.leadingParty}</h2>
                      <Badge bg="success" className="px-3 py-2">
                        {stats.leadingVotes.toLocaleString()} votes
                      </Badge>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Card className="shadow-sm mt-4">
                <Card.Body>
                  <h4 className="mb-4">वोट वितरण / Vote Distribution</h4>
                  <Table striped hover responsive>
                    <thead className="bg-light">
                      <tr>
                        <th>Party Name</th>
                        <th>Votes Received</th>
                        <th>Vote Share</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(voteData).map(([party, votes]) => (
                        <tr key={party}>
                          <td><strong>{party}</strong></td>
                          <td>{votes.toLocaleString()}</td>
                          <td>
                            {((votes / stats.totalVotes) * 100).toFixed(2)}%
                          </td>
                          <td>
                            {party === stats.leadingParty ? (
                              <Badge bg="success">Leading</Badge>
                            ) : (
                              <Badge bg="secondary">Trailing</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </>
          )}
        </Card>

        <Card className="p-4 shadow-lg" style={{ borderRadius: '15px' }}>
          <div className="text-center">
            <p className="text-muted mb-0">
              Last Updated: {new Date().toLocaleString()}
            </p>
            <p className="text-muted">
              For more information, visit: www.eci.gov.in
            </p>
            <p className="text-muted">
              For assistance, contact toll-free: 1800-111-950
            </p>
          </div>
        </Card>
      </Container>
    </Container>
  );
}