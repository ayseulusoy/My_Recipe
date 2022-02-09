import React, { useEffect, useState } from 'react'
import { Button, Nav, Navbar } from 'react-bootstrap'
import "bootstrap/dist/css/bootstrap.min.css"
import { Link } from 'react-router-dom';
import base64 from 'base-64';

//const API_BASE = "http://localhost:3001";

function App() {
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            const parts = token.split('.');
            var decodedToken = base64.decode(parts[1]);
            const user = JSON.parse(decodedToken);
            if (!user) {
                localStorage.removeItem('token')
                window.location.href = '/login'
            } else {
                console.log(user)
                setUserName([...userName, user.userName])
                setUserEmail([...userEmail, user.userEmail])
            }
        }
    }, []);

    const Logout = async () => {
        localStorage.removeItem('token')
        window.location.href = '/'
    }

    return (
        <div>

            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/">My Recipes</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                {
                    userEmail ? (
                        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                            <Nav>
                                <Nav.Item>
                                    <Button variant="dark"> {userName} </Button>{' '}
                                </Nav.Item>
                                <Nav.Item>
                                    <Button variant="dark" onClick={Logout}>LogOut</Button>{' '}
                                </Nav.Item>
                            </Nav>
                        </Navbar.Collapse>
                    ) : (
                        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                            <Nav>
                                <Nav.Item>
                                    <Link to="/"><Button variant="dark">Home</Button>{' '}</Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Link to="/Login"><Button variant="dark">Login</Button>{' '}</Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Link to="/Register"><Button variant="dark">Register</Button>{' '}</Link>
                                </Nav.Item>
                            </Nav>
                        </Navbar.Collapse>
                    )
                }


            </Navbar>
        </div>
    );
}
export default App;