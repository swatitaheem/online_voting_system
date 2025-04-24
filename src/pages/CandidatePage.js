import React from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import { toast } from 'react-toastify';
import logo from '../logo.jpeg';

const candidateData = [
  {
    id: 'bjp',
    name: 'Bharatiya Janata Party (BJP)',
    candidateName: 'Narendra Modi',
    position: 'Prime Ministerial Candidate',
    work: 'Digital India, Ujjwala Yojana, Make in India',
    achievements: [
      'Implementation of GST',
      'Digital India Initiative',
      'Smart Cities Mission',
      'Swachh Bharat Abhiyan'
    ],
    experience: '20+ years in politics',
    education: 'Masters in Political Science',
    imageUrl: '/bjp-logo.png'
  },
  {
    id: 'inc',
    name: 'Indian National Congress (INC)',
    candidateName: 'Rahul Gandhi',
    position: 'Party President',
    work: 'RTI Act, MNREGA, National Food Security Act',
    achievements: [
      'Right to Information Act',
      'MNREGA Implementation',
      'Food Security Bill',
      'Rural Development Projects'
    ],
    experience: '15+ years in politics',
    education: 'M.Phil in Development Studies',
    imageUrl: '/inc-logo.png'
  },
  {
    id: 'aap',
    name: 'Aam Aadmi Party (AAP)',
    candidateName: 'Arvind Kejriwal',
    position: 'National Convenor',
    work: 'Free electricity, Education reform',
    achievements: [
      'Delhi Education Model',
      'Free Healthcare Initiative',
      'Power Sector Reforms',
      'Anti-Corruption Movement'
    ],
    experience: '10+ years in politics',
    education: 'IIT Graduate',
    imageUrl: '/aap-logo.png'
  },
  {
    id: 'sp',
    name: 'Bahujan Samaj Party (BSP)',
    candidateName: 'Mayawati',
    position: 'Party President',
    work: 'Rural development, Infrastructure',
    achievements: [
      'Social Justice Initiatives',
      'Infrastructure Development',
      'Rural Employment Schemes',
      'Education Reforms'
    ],
    experience: '25+ years in politics',
    education: 'B.A., L.L.B.',
    imageUrl: '/bsp-logo.png'
  }
];

export default function CandidatePage() {
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
            <h4 className="text-muted mb-4">उम्मीदवार प्रोफाइल / Candidate Profiles</h4>
          </div>
        </Card>

        <Row>
          {candidateData.map((candidate) => (
            <Col md={6} className="mb-4" key={candidate.id}>
              <Card className="h-100 shadow-lg" style={{ borderRadius: '15px' }}>
                <Card.Body>
                  <div className="d-flex align-items-center mb-4">
                    <Image 
                      src={candidate.imageUrl} 
                      alt={candidate.name}
                      width="60"
                      height="60"
                      className="me-3"
                      style={{ borderRadius: '50%' }}
                    />
                    <div>
                      <h5 className="mb-0">{candidate.name}</h5>
                      <p className="text-muted mb-0">{candidate.position}</p>
                    </div>
                  </div>

                  <hr />

                  <h6 className="text-primary">Candidate Details</h6>
                  <p><strong>Name:</strong> {candidate.candidateName}</p>
                  <p><strong>Experience:</strong> {candidate.experience}</p>
                  <p><strong>Education:</strong> {candidate.education}</p>

                  <h6 className="text-primary mt-4">Key Initiatives</h6>
                  <p>{candidate.work}</p>

                  <h6 className="text-primary mt-4">Major Achievements</h6>
                  <ul className="list-unstyled">
                    {candidate.achievements.map((achievement, index) => (
                      <li key={index} className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="text-center mt-4">
          <p className="text-muted">
            For more information about candidates, visit: www.eci.gov.in
          </p>
          <p className="text-muted">
            For assistance, contact toll-free: 1800-111-950
          </p>
        </div>
      </Container>
    </Container>
  );
}