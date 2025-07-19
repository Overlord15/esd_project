// Navbar.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Navbar = () => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Function to fetch user data from Firestore
    const fetchUserDataFromFirestore = async (uid: string) => {
        try {
            const q = query(collection(db, 'users'), where('uid', '==', uid));
            const snapshot = await getDocs(q);
            
            if (!snapshot.empty) {
                const userDoc = snapshot.docs[0].data();
                console.log('Fetched user data from Firestore:', userDoc);
                setUserData(userDoc);
                
                // Update localStorage with fresh data
                localStorage.setItem('userSession', JSON.stringify(userDoc));
                return userDoc;
            }
        } catch (error) {
            console.error('Error fetching user data from Firestore:', error);
        }
        return null;
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            console.log('Auth state changed:', currentUser?.uid);
            setUser(currentUser);
            
            if (currentUser) {
                // First try localStorage
                const storedSession = localStorage.getItem('userSession');
                console.log('Stored session:', storedSession);
                
                if (storedSession) {
                    const parsedData = JSON.parse(storedSession);
                    console.log('Parsed session data:', parsedData);
                    
                    // Check if we have firstName, if not fetch from Firestore
                    if (parsedData.firstName) {
                        setUserData(parsedData);
                    } else {
                        console.log('No firstName in localStorage, fetching from Firestore...');
                        await fetchUserDataFromFirestore(currentUser.uid);
                    }
                } else {
                    console.log('No session in localStorage, fetching from Firestore...');
                    await fetchUserDataFromFirestore(currentUser.uid);
                }
            } else {
                setUserData(null);
            }
            
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Listen for localStorage changes (when Login component stores data)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'userSession' && e.newValue) {
                console.log('localStorage userSession updated:', e.newValue);
                const newUserData = JSON.parse(e.newValue);
                setUserData(newUserData);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('userSession');
            localStorage.removeItem('isAuthenticated');
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-md navbar-light bg-light shadow-sm">
                <div className="container">
                    <a className="navbar-brand" href="#">ESD</a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNavDropdown"
                        aria-controls="navbarNavDropdown"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            {!loading && user ? (
                                <li className="nav-item">
                                    <span className="nav-link">
                                        Hi, {userData?.firstName || 'User'}
                                        {!userData?.firstName && <small> (loading...)</small>}
                                    </span>
                                </li>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">Docs</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">Pricing</a>
                                    </li>
                                </>
                            )}
                            
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    id="navbarDropdownMenuLink"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    More
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <li><a className="dropdown-item" href="#">About</a></li>
                                    <li><a className="dropdown-item" href="#">Contact</a></li>
                                    <li><a className="dropdown-item" href="#">Developers</a></li>
                                    
                                    {!loading && user && (
                                        <>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li><a className="dropdown-item" href="#">Docs</a></li>
                                            <li><a className="dropdown-item" href="#">Pricing</a></li>
                                        </>
                                    )}
                                </ul>
                            </li>
                            
                            {!loading && user && (
                                <li className="nav-item">
                                    <button 
                                        className="nav-link btn btn-link text-decoration-none"
                                        onClick={handleLogout}
                                        style={{ 
                                            border: 'none', 
                                            background: 'none',
                                            color: 'inherit'
                                        }}
                                    >
                                        Logout
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
