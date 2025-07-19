// src/components/Login.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth';
import {
    collection,
    addDoc,
    getDocs,
    query,
    where
} from 'firebase/firestore';

const Login: React.FC = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        screenName: '',
        password: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Check if user is already logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, redirect to dashboard
                navigate('/dashboard');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const storeUserSession = async (user: any, userData: any) => {
        const sessionData = {
            uid: user.uid,
            email: user.email,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            screenName: userData.screenName || '',
            createdAt: userData.createdAt || new Date().toISOString()
        };

        console.log('Storing session data:', sessionData); // Debug log

        // Store in localStorage for persistence
        localStorage.setItem('userSession', JSON.stringify(sessionData));
        localStorage.setItem('isAuthenticated', 'true');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { firstName, lastName, email, screenName, password } = formData;

        try {
            if (isRegister) {
                // Registration
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const newUserData = {
                    uid: userCredential.user.uid,
                    firstName,
                    lastName,
                    email,
                    screenName,
                    createdAt: new Date().toISOString()
                };

                // First save to Firestore
                await addDoc(collection(db, 'users'), newUserData);

                // Then store session with complete data
                await storeUserSession(userCredential.user, newUserData);

                console.log('Registration successful, user data:', newUserData); // Debug log

                // Redirect to dashboard
                navigate('/dashboard');
            } else {
                // Login
                const q = query(collection(db, 'users'), where('screenName', '==', screenName));
                const snapshot = await getDocs(q);

                if (snapshot.empty) throw new Error('Screen name not found');

                const userData = snapshot.docs[0].data();
                console.log('Fetched user data for login:', userData); // Debug log

                const userCredential = await signInWithEmailAndPassword(auth, userData.email, password);

                // Store session with fetched user data
                await storeUserSession(userCredential.user, userData);

                // Redirect to dashboard
                navigate('/dashboard');
            }
        } catch (err: any) {
            console.error('Login/Registration error:', err); // Debug log
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="row w-100 justify-content-center">
                <div className="col-md-6 col-sm-12">
                    <div className="card shadow">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">{isRegister ? 'Register' : 'Login'}</h3>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                {isRegister && (
                                    <>
                                        <div className="mb-3">
                                            <label className="form-label">First Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Last Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </>
                                )}
                                <div className="mb-3">
                                    <label className="form-label">Screen Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="screenName"
                                        value={formData.screenName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                    {loading ? 'Processing...' : isRegister ? 'Register' : 'Login'}
                                </button>
                            </form>
                            <div className="text-center mt-3">
                                <button
                                    className="btn btn-link"
                                    onClick={() => {
                                        setIsRegister(!isRegister);
                                        setError(null);
                                        setFormData({
                                            firstName: '',
                                            lastName: '',
                                            email: '',
                                            screenName: '',
                                            password: ''
                                        });
                                    }}
                                >
                                    {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
