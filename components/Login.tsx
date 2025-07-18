// src/components/Login.tsx
import React, { useState } from 'react';
import { auth, db } from '../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { firstName, lastName, email, screenName, password } = formData;

        try {
            if (isRegister) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await addDoc(collection(db, 'users'), {
                    uid: userCredential.user.uid,
                    firstName,
                    lastName,
                    email,
                    screenName,
                });
            } else {
                const q = query(collection(db, 'users'), where('screenName', '==', screenName));
                const snapshot = await getDocs(q);

                if (snapshot.empty) throw new Error('Screen name not found');
                const userData = snapshot.docs[0].data();
                await signInWithEmailAndPassword(auth, userData.email, password);
            }

            alert(`${isRegister ? 'Registered' : 'Logged in'} successfully`);
        } catch (err: any) {
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
                                            <input type="text" className="form-control" name="firstName" onChange={handleChange} required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Last Name</label>
                                            <input type="text" className="form-control" name="lastName" onChange={handleChange} required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Email</label>
                                            <input type="email" className="form-control" name="email" onChange={handleChange} required />
                                        </div>
                                    </>
                                )}
                                <div className="mb-3">
                                    <label className="form-label">Screen Name</label>
                                    <input type="text" className="form-control" name="screenName" onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input type="password" className="form-control" name="password" onChange={handleChange} required />
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
