import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import Vote from './pages/VotePage';
import Candidate from './pages/CandidatePage';
import Result from './pages/ResultPage';
import AdminLogin from './Admin';
import Navbar from './pages/Navbar';
import AdminDashboard from './pages/AdminPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <> 
    <Navbar />  
     <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/candidates" element={<Candidate />} />
        <Route path="/results" element={<Result />} />
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;



