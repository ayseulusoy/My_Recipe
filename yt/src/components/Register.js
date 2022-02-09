import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { Button, Container, Form, Row, Col, Card } from 'react-bootstrap'

const API_BASE = "http://localhost:3001";

function Register() {
    const [users, setUsers] = useState([])
    const [newUserName, setNewUserName] = useState("")
    const [newUserEmail, setNewUserEmail] = useState("")
    const [newUserPassword, setNewUserPassword] = useState("")

    useEffect(() => {
        GetUsers();

    }, []);

    const GetUsers = () => {
        fetch(API_BASE + "/users")
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error("Error: ", err));
    }

    const AddUser = async () => {
        const data = await fetch(API_BASE + "/user/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userName: newUserName,
                userEmail: newUserEmail,
                userPassword: newUserPassword
            })
        }).then(res => res.json());

        setUsers([...users, data]);
        setNewUserName("");
        setNewUserEmail("");
        setNewUserPassword("");
    }

    return (
        <div>
            <Navbar />
            <br />
            <Container fluid="md">
                <Row>
                    <Col></Col>
                    <Col xs={8}>
                        <Card border="dark">
                            <Card.Header><h1 className='text-center'>Register</h1></Card.Header>
                            <Card.Body>
                                <Form onSubmit={AddUser} >
                                    <Form.Group className="mb-3" controlId="formGroupName">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter name"
                                            required
                                            onChange={e => setNewUserName(e.target.value)}
                                            value={newUserName} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formGroupEmail">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter email"
                                            required
                                            onChange={e => setNewUserEmail(e.target.value)}
                                            value={newUserEmail} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formGroupPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            required
                                            onChange={e => setNewUserPassword(e.target.value)}
                                            value={newUserPassword} />
                                    </Form.Group>
                                    <Button className="mb-2" variant="dark" size="lg" type="submit">
                                        Register
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        </div>
    );
}

export default Register;