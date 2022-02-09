import React, { useState } from 'react';
import Navbar from './Navbar';
import {Button,Container,Form,Row,Col,Card} from 'react-bootstrap'

const API_BASE="http://localhost:3001";

function Login() {
    
const [userEmail,setUserEmail]=useState('')
const [userPassword,setUserPassword]=useState('')

async function LoginUser(event){
    event.preventDefault()

    const response = await fetch(API_BASE + '/user/login',{
        method:'POST',
        headers: {
            'Content-Type':'application/json',
        },
        body: JSON.stringify({
            userEmail,
            userPassword
        }),
    })

    const data = await response.json()

    if(data.user){
        localStorage.setItem('token',data.user)
        window.location.href='/'
    }else{
        alert('Please check your email and password')
    }
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
                <Card.Header><h1 className='text-center'>Login</h1></Card.Header>
                <Card.Body>
                <Form onSubmit={LoginUser}>
                <Form.Group className="mb-3" controlId="formGroupEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                        type="email" 
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="Enter email" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password"
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                        placeholder="Password" />
                </Form.Group>
                <Button className="mb-2" variant="dark" size="lg" type="submit">
                    Login
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

export default Login;
