// Navbar.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut, onAuthStateChanged, type User } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Navbar = () => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
            setIsMenuOpen(false); // Close menu after logout
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleLogoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (user && !loading) {
            navigate('/dashboard');
        } else {
            navigate('/');
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleDashboardClick = () => {
        navigate('/dashboard');
        closeMenu();
    };

    const handleCalendarClick = () => {
        navigate('/calendar');
        closeMenu();
    };

    const handleTaskClick = () => {
        navigate('/tasks');
        closeMenu();
    };

    const handleWhiteBoardClick = () => {
        navigate('/whiteboard');
        closeMenu();
    };

    return (
        <>
            {/* Add custom CSS for animations */}
            <style>{`
                .navbar-collapse {
                    transition: all 0.3s ease-in-out;
                    overflow: hidden;
                }
                
                .navbar-collapse.collapsing {
                    transition: height 0.3s ease-in-out;
                }
                
                .navbar-collapse.show {
                    animation: slideDown 0.3s ease-in-out;
                }
                
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .navbar-toggler {
                    transition: all 0.3s ease;
                    border: none !important;
                    padding: 4px 8px;
                }
                
                .navbar-toggler:focus {
                    box-shadow: none !important;
                }
                
                .navbar-toggler-icon {
                    transition: all 0.3s ease;
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%2833, 37, 41, 0.75%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='m4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
                }
                
                .navbar-toggler.menu-open .navbar-toggler-icon {
                    transform: rotate(90deg);
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%2833, 37, 41, 0.75%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='m6 6l18 18M6 24L24 6'/%3e%3c/svg%3e");
                }
                
                .navbar-nav .nav-item {
                    transition: all 0.2s ease;
                }
                
                .navbar-nav .nav-link {
                    transition: all 0.2s ease;
                    position: relative;
                }
                
                .navbar-nav .nav-link:hover {
                    color: #0d6efd !important;
                    transform: translateY(-1px);
                }
                
                .navbar-brand {
                    transition: all 0.2s ease;
                    cursor: pointer;
                }
                
                .navbar-brand:hover {
                    color: #0d6efd !important;
                    transform: scale(1.05);
                }
                
                .dropdown-menu {
                    animation: fadeIn 0.2s ease-in-out;
                    border: none;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-5px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .dropdown-item {
                    transition: all 0.2s ease;
                }
                
                .dropdown-item:hover {
                    background-color: #f8f9fa;
                    padding-left: 1.8rem;
                }
                
                @media (max-width: 767.98px) {
                    .navbar-nav .nav-item {
                        margin: 0.2rem 0;
                        border-radius: 4px;
                        overflow: hidden;
                    }
                    
                    .navbar-nav .nav-link {
                        padding: 0.75rem 1rem;
                        border-radius: 4px;
                        margin: 0.1rem 0;
                    }
                    
                    .navbar-nav .nav-link:hover {
                        background-color: #f8f9fa;
                        transform: translateX(5px);
                    }
                }
                
                .dashboard-btn {
                    // background: linear-gradient(45deg, #0d6efd, #0056b3);
                    // border: none;
                    color: black !important;
                    // border-radius: 6px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    // box-shadow: 0 2px 4px rgba(13, 110, 253, 0.2);
                }
                
                .dashboard-btn:hover {
                    // background: linear-gradient(45deg, #0056b3, #004085);
                    transform: translateY(-2px);
                    // box-shadow: 0 4px 8px rgba(13, 110, 253, 0.3);
                    color: blue !important;
                }
                
                .logout-btn {
                    // background: linear-gradient(45deg, #dc3545, #b02a37);
                    // border: 2px solid rgba(220, 53, 69, 0.5);;
                    color: black !important;
                    // border-radius: 6px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    // box-shadow: 0 2px 4px rgba(220, 53, 69, 0.2);
                }
                
                .logout-btn:hover {
                    // background: rgba(220, 53, 69, 0.2);;
                    transform: translateX(-2px);
                    // box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
                    color: red !important;
                }
                
                @media (max-width: 767.98px) {
                    .dashboard-btn, .logout-btn {
                        margin: 0.5rem 0;
                        text-align: center;
                        display: block;
                        width: 100%;
                    }
                }
                
                .user-greeting {
                    // background: linear-gradient(45deg, #28a745, #1e7e34);
                    color: black !important;
                    // border-radius: 20px;
                    padding: 0.5rem 1rem !important;
                    font-weight: 500;
                    // border: 2px solid rgba(129, 129, 129, 0.5);
                    transition: all 0.3s ease;
                }
                
                .user-greeting:hover {
                    transform: scale(0.98);
                    box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
                }
                
                @media (max-width: 767.98px) {
                    .user-greeting {
                        text-align: center;
                        margin: 0.5rem 0;
                    }
                }
            `}</style>

            <nav className="navbar navbar-expand-md navbar-light bg-light shadow-sm">
                <div className="container">
                    <a
                        className="navbar-brand fw-bold"
                        href="/"
                        onClick={handleLogoClick}
                        style={{
                            color: user && !loading ? '#0d6efd' : 'inherit',
                            textDecoration: 'none'
                        }}
                    >
                        <img src="opc.png" height="35px" alt="" />
                    </a>

                    <button
                        className={`navbar-toggler ${isMenuOpen ? 'menu-open' : ''}`}
                        type="button"
                        onClick={toggleMenu}
                        aria-controls="navbarNavDropdown"
                        aria-expanded={isMenuOpen}
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div
                        className={`collapse navbar-collapse justify-content-end ${isMenuOpen ? 'show' : ''}`}
                        id="navbarNavDropdown"
                    >
                        <ul className="navbar-nav">
                            {/* User Greeting - First */}
                            {!loading && user ? (
                                <li className="nav-item">
                                    <span className="nav-link user-greeting">
                                        👋 Hi, {userData?.firstName || 'User'}
                                        {!userData?.firstName && (
                                            <span className="spinner-border spinner-border-sm ms-2" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </span>
                                        )}
                                    </span>
                                </li>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <a
                                            className="nav-link"
                                            href="#"
                                            onClick={closeMenu}
                                        >
                                            📚 Docs
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a
                                            className="nav-link"
                                            href="#"
                                            onClick={closeMenu}
                                        >
                                            💰 Pricing
                                        </a>
                                    </li>
                                </>
                            )}

                            {/* Dashboard Button - Second */}
                            {!loading && user && (
                                <li className="nav-item">
                                    <button
                                        className="nav-link btn dashboard-btn"
                                        onClick={handleDashboardClick}
                                    >
                                        📊 Dashboard
                                    </button>
                                </li>
                            )}

                            {/* More Dropdown - Third */}
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    id="navbarDropdownMenuLink"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    ⚡ More
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    {/* Logged-in user specific menu items */}
                                    {!loading && user && (
                                        <>
                                            <li>
                                                <button
                                                    className="dropdown-item w-100 text-start border-0 bg-transparent"
                                                    onClick={handleCalendarClick}
                                                >
                                                    📅 Calendar
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item w-100 text-start border-0 bg-transparent"
                                                    onClick={handleTaskClick}
                                                >
                                                    ✅ Tasks
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item w-100 text-start border-0 bg-transparent"
                                                    onClick={handleWhiteBoardClick}
                                                >
                                                    🎨 White Board
                                                </button>
                                            </li>
                                            <li><hr className="dropdown-divider" /></li>
                                        </>
                                    )}

                                    {/* General menu items */}
                                    <li>
                                        <a
                                            className="dropdown-item"
                                            href="#"
                                            onClick={closeMenu}
                                        >
                                            ℹ️ About
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="dropdown-item"
                                            href="#"
                                            onClick={closeMenu}
                                        >
                                            📞 Contact
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="dropdown-item"
                                            href="#"
                                            onClick={closeMenu}
                                        >
                                            👨‍💻 Developers
                                        </a>
                                    </li>

                                    {/* Logged-in user docs and pricing */}
                                    {!loading && user && (
                                        <>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li>
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                    onClick={closeMenu}
                                                >
                                                    📚 Docs
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                    onClick={closeMenu}
                                                >
                                                    💰 Pricing
                                                </a>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </li>

                            {/* Logout Button - Fourth */}
                            {!loading && user && (
                                <li className="nav-item">
                                    <button
                                        className="nav-link btn logout-btn"
                                        onClick={handleLogout}
                                    >
                                        🚪 Logout
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
