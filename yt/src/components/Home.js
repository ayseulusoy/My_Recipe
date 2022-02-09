import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Navbar from './Navbar';
import Recipe from './Recipes';
import Chat from './Chat';

function Home() {
  return (
    <div>
      <Navbar />
      <br />
      <Container fluid="md">
        <Row >
          <Col className='col-8 mb-4'>
            <Recipe />
          </Col>
          <Col className='col-4 mb-4'>
            <Chat />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;