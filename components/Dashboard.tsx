import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const storedSession = localStorage.getItem('userSession');
        if (storedSession) {
          setUserData(JSON.parse(storedSession));
        }
      } else {
        navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
    navigate('/');
  };

  if (loading || !userData) {
    return <div>Loading...</div>;
  }

  // Build the username (use both names if available)
  const username = userData.firstName && userData.lastName
    ? `${userData.firstName} ${userData.lastName}`
    : userData.firstName || userData.screenName || 'User';

  return (
    <div className="container-fluid">
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h4 className="mb-0">{username}, Dashboard</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h5>User Information</h5>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item">
                        <strong>Name:</strong> {username}
                      </li>
                      <li className="list-group-item">
                        <strong>Email:</strong> {userData.email}
                      </li>
                      <li className="list-group-item">
                        <strong>Screen Name:</strong> {userData.screenName}
                      </li>
                      <li className="list-group-item">
                        <strong>User ID:</strong> {userData.uid}
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h5>Quick Actions</h5>
                    <div className="d-grid gap-2">
                      <button className="btn btn-outline-primary" type="button">
                        Edit Profile
                      </button>
                      <button className="btn btn-outline-secondary" type="button">
                        View Activity
                      </button>
                      <button className="btn btn-outline-info" type="button">
                        Settings
                      </button>
                    </div>
                  </div>
                </div>
                {/* Launch Buttons Grid */}
                <div className="row mt-4">
                  <div className="col-md-4 d-grid">
                    <button
                      className="btn btn-success"
                      onClick={() => navigate('/calendar')}
                    >
                      Launch Calendar
                    </button>
                  </div>
                  <div className="col-md-4 d-grid">
                    <button
                      className="btn btn-warning"
                      onClick={() => navigate('/tasks')}
                    >
                      Launch Tasks
                    </button>
                  </div>
                  <div className="col-md-4 d-grid">
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate('/whiteboard')}
                    >
                      Launch Whiteboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
