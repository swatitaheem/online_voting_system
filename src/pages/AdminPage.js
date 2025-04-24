import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Card, Row, Col, Badge, Spinner, Image, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaVoteYea, FaUsers, FaChartBar, FaPercentage, FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../logo.jpeg';

export default function AdminPanel() {
  const [votes, setVotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVotes: 0,
    highestVotes: 0,
    votingPercentage: 0,
    leadingParty: ''
  });
  const [isResultPublic, setIsResultPublic] = useState(false);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await axios.get('http://localhost:5000/results');
      if (response.data.success) {
        const voteData = response.data.data.votes;
        setVotes(voteData);
        calculateStats(voteData);
        setIsResultPublic(response.data.data.isResultPublic || false);
      } else {
        toast.error('Failed to load results');
      }
    } catch (error) {
      console.error('Error loading results:', error);
      toast.error('Error loading election results');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleResult = async () => {
    try {
      const response = await axios.post('http://localhost:5000/admin/toggle-result', {
        isResultPublic: !isResultPublic
      });

      if (response.data.success) {
        setIsResultPublic(!isResultPublic);
        toast.success(`Results ${!isResultPublic ? 'published' : 'hidden'} successfully`);
      }
    } catch (error) {
      console.error('Error toggling result visibility:', error);
      toast.error('Failed to update result visibility');
    }
  };

  const calculateStats = (voteData) => {
    const totalVotes = Object.values(voteData).reduce((a, b) => a + b, 0);
    const highestVotes = Math.max(...Object.values(voteData));
    const leadingParty = Object.entries(voteData).find(([_, count]) => count === highestVotes)?.[0];
    
    setStats({
      totalVotes,
      highestVotes,
      votingPercentage: ((totalVotes / 100000) * 100).toFixed(2), // Assuming total registered voters
      leadingParty
    });
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa' }}>
      <Container>
        <Card className="shadow-sm mb-4">
          <Card.Body className="text-center">
            <Image 
              src={logo} 
              alt="ECI Logo" 
              height="60" 
              className="mb-3"
            />
            <h2 className="text-primary">प्रशासन डैशबोर्ड</h2>
            <h3 className="text-secondary">Admin Dashboard</h3>
          </Card.Body>
        </Card>

        <Row className="g-4 mb-4">
          <Col md={3}>
            <Card className="shadow-sm h-100">
              <Card.Body className="text-center">
                <FaVoteYea size={30} className="text-primary mb-2" />
                <h5>Total Votes</h5>
                <h3>{stats.totalVotes.toLocaleString()}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm h-100">
              <Card.Body className="text-center">
                <FaChartBar size={30} className="text-success mb-2" />
                <h5>Highest Votes</h5>
                <h3>{stats.highestVotes.toLocaleString()}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm h-100">
              <Card.Body className="text-center">
                <FaPercentage size={30} className="text-warning mb-2" />
                <h5>Voting Percentage</h5>
                <h3>{stats.votingPercentage}%</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm h-100">
              <Card.Body className="text-center">
                <FaUsers size={30} className="text-info mb-2" />
                <h5>Leading Party</h5>
                <h3>{stats.leadingParty}</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="shadow-sm mb-4">
          <Card.Body className="text-center">
            <h4 className="mb-3">Result Visibility Control</h4>
            <div className="d-flex justify-content-center align-items-center gap-3">
              <div className="text-muted">
                Current Status: 
                <Badge bg={isResultPublic ? "success" : "warning"} className="ms-2">
                  {isResultPublic ? "Published" : "Hidden"}
                </Badge>
              </div>
              <Button
                variant={isResultPublic ? "danger" : "success"}
                size="lg"
                onClick={handleToggleResult}
                className="px-4"
              >
                {isResultPublic ? (
                  <>
                    <FaEyeSlash className="me-2" />
                    Hide Results
                  </>
                ) : (
                  <>
                    <FaEye className="me-2" />
                    Publish Results
                  </>
                )}
              </Button>
            </div>
          </Card.Body>
        </Card>

        <Card className="shadow-sm">
          <Card.Body>
            <h4 className="mb-4">Vote Distribution</h4>
            <Table striped hover responsive>
              <thead className="bg-light">
                <tr>
                  <th>#</th>
                  <th>Party Name</th>
                  <th>Votes Received</th>
                  <th>Vote Share</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(votes).map(([party, count], index) => (
                  <tr key={party}>
                    <td>{index + 1}</td>
                    <td>
                      <strong>{party}</strong>
                    </td>
                    <td>{count.toLocaleString()}</td>
                    <td>
                      {((count / stats.totalVotes) * 100).toFixed(2)}%
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

        <div className="text-center mt-4">
          <p className="text-muted">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </Container>
    </Container>
  );
}

