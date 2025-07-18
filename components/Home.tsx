import React from 'react';
import { Link } from "react-router-dom";


const Home: React.FC = () => {

    return (
        <>
            <div className="container text-center mt-5">
                <h1 className="display-5 fw-bold">Cleaner space for your tech journey.</h1>
                <p className="lead mb-4">
                    A versatile Markdown editor with encrypted data sync, cross-platform support, 100+ plugins, and beautiful themes.
                </p>
                <Link to="/login" className="btn btn-primary">
                    Login
                </Link>

                <div className="row gy-4">
                    <div className="col-md-4">
                        <h3>Encrypted data sync</h3>
                        <p>Securely sync your notes across devices with end-to-end encryption.</p>
                    </div>
                    <div className="col-md-4">
                        <h3>Cross-platform</h3>
                        <p>Available on Linux, macOS, Windows, iOS, and Android.</p>
                    </div>
                    <div className="col-md-4">
                        <h3>100+ plugins</h3>
                        <p>Customize your workflow with a rich plugin ecosystem.</p>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Home;
