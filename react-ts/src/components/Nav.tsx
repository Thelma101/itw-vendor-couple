import React from "react";
import { Link } from "react-router-dom";
import "./Nav.css";

export default function Nav() {
    return (
        <nav className="nav">
            <div>
                <Link to="/" className="site-title">ITHEEWED DASHBOARD</Link>
            </div>
            <div>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                    <li>
                        <Link to="/contact">Contact</Link>
                    </li>
                </ul>
            </div>
            <div>
                <ul>
                    <li>
                        <Link to="/signIn"> Sign In</Link>
                    </li>
                    <li>
                        <Link to="/signUp"> Sign Up</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};
