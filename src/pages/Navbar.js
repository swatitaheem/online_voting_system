import React from 'react'
import logo from '../logo.jpeg'
export default function Navbar() {
    return (
        <>
            <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#FF9933' }}>
                <div className="container-fluid">
                    <a className="navbar-brand d-flex align-items-center" href="/">
                        <img src={logo} alt="National Emblem" height="40" className="me-2"/>
                        <span style={{ color: '#000080' }}>VoteBharat</span>
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/vote">मुख्य पृष्ठ / Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/candidates">Candidates</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/results">Results</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}
