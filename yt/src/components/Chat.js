import React, { useState, useEffect } from 'react';
import { Card, Modal, Row, Col, Button, ButtonGroup, Form, InputGroup, Container } from 'react-bootstrap';
import base64 from 'base-64';

const API_BASE = "http://localhost:3001";

function Chat() {
  const [messagess, setMessagess] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [id, setId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [toUser, setToUser] = useState("");
  const [form, setForm] = useState({
    mes: "",
  })
  var mesUser = "";

  const token = localStorage.getItem('token')
  if (token) {
    const parts = token.split('.');
    var decodedToken = base64.decode(parts[1]);
    mesUser = JSON.parse(decodedToken);
    mesUser = mesUser.userEmail;
  }

  useEffect(() => {
    getMessages(mesUser);
  }, []);

  const getMessages = async (mesUser) => {
    if (mesUser !== '') {
      const data = await fetch(API_BASE + "/messages/" + mesUser)
        .then(res => res.json())
        .then(data => setMessagess(data))
        .catch((err) => console.error("Error: ", err));
    }
  }

  const handleClose = () => {
    setModalShow(false);
    window. location. reload()
  }
  const handleShow = (e, id, toUser, userEmail) => {
    e.preventDefault()
    setModalShow(true)
    setId(id);
    setUserEmail(userEmail);
    setToUser(toUser);
  };

  const sendamsg = async (e, id, toUser, userEmail) => {
    e.preventDefault()
    if (toUser === mesUser) {
      toUser = userEmail;
      userEmail = mesUser;
    }
    const data = await fetch(API_BASE + '/messages/addAMesssage/' + id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userEmail: mesUser,
        toUser: toUser,
        mes: form.mes,
      })
    }).then(res => res.json());

    handleClose();
    setForm({
      mes: "",
    });
  }

  return (
    <div>
      <Modal show={modalShow} scrollable={true}>
        <Modal.Header>
          <h2>Messages</h2>
          <Button variant="danger" size="lg" type="button" onClick={handleClose}>Close</Button>
        </Modal.Header>
        <Modal.Body >
          {
            messagess.map((msg) => (
              <div>
                {
                  id === msg._id ? ((msg.messages.map((m) =>
                    <div>
                      <Form>
                        <Container>
                          <Form.Group>
                            <div>
                              <hr></hr>
                              <Form.Text>
                                {m.userEmail}:
                              </Form.Text>
                              <br></br>
                              <Form.Text>
                                {m.mes}
                              </Form.Text>
                            </div>
                          </Form.Group>
                        </Container>
                      </Form>
                    </div>
                  ))) : (
                    <div>
                    </div>
                  )
                }
              </div>
            ))
          }
          <hr></hr>
          <Form onSubmit={e => sendamsg(e, id, toUser, userEmail)}>
            <InputGroup >
              <Form.Control
                maxlength="65"
                type="text"
                placeholder="Enter message"
                required
                value={form.mes}
                onChange={e => setForm({ ...form, mes: e.target.value })}
              />
              <Button type="submit" variant="success">Send</Button>
            </InputGroup>
          </Form>
        </Modal.Body>
      </Modal>
      
      <Row className='p-1'>
        <Col className='col-sm-12 col-md-12 col-lg-12 col-xl-12 mx-auto my-1'>
          <Row className='row-cols-1 row-cols-xl-1'>
            {
              messagess.length > 0 ? messagess.map(msg => (
                <Col className='mb-1' key={msg._id}>
                  <Card className="bg-dark text-white">
                    <Card.Header>
                      <h1 >{msg.userEmail}</h1>
                      <hr />
                      <h2>{msg.toUser}</h2>
                    </Card.Header>
                    <hr></hr>
                    <ButtonGroup className="ms-2  me-2">
                      <Button
                        variant="outline-primary"
                        type='button'
                        onClick={e => handleShow(e, msg._id, msg.toUser, msg.userEmail)}>Send Message</Button>
                    </ButtonGroup>
                    <hr />
                  </Card >
                </Col>
              )) : (
                <div>
                  <p>No messages</p>
                </div>
              )
            }
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default Chat;
