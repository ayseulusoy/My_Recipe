import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Button, ButtonGroup, Modal, Form, Stack, Row, Col,InputGroup } from 'react-bootstrap';
import base64 from 'base-64';

const API_BASE = "http://localhost:3001";

function Recipes() {

  const [recipes, setRecipes] = useState([]);
  const [messages, setMessages] = useState([]);

  const [modalShow, setModalShow] = useState(false);
  const [modalShowM, setModalShowM] = useState(false);

  const [toUser, setToUser] = useState("");
  const [msg,setMsg]=useState("Hello");

  const [form, setForm] = useState({
    recipeName: "",
    recipeDesc: "",
    recipeIngredients: [],
    recipeSteps: []
  });

  useEffect(() => {
    getRecipes();
  }, []);

  const getRecipes = () => {
    fetch(API_BASE + "/recipes")
      .then(res => res.json())
      .then(data => setRecipes(data))
      .catch(err => console.error("Error: ", err));
  }

  const msgIdCont = async (e, user2) => {
    e.preventDefault();
    const token = localStorage.getItem('token')
    if (token) {
      const parts = token.split('.');
      const decodedToken = base64.decode(parts[1]);
      var mesUser = JSON.parse(decodedToken);
    }else {
      window.location.href = "/login";
    }
    if (mesUser.userEmail === toUser) {
      alert("This is your recipe");
      return;
    }
    const data = await fetch(API_BASE + '/messages/msgIdCont/' + user2, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userEmail: mesUser.userEmail,
        toUser: user2
      })
    }).then(res => res.json());
    setModalShowM(data);
    if (data === false) {
      alert("You already have a mailbox with this user!")
    }
    setToUser(user2);
  }

  const handleClose = () => {
    setModalShow(false);
    setModalShowM(false);
    window. location. reload()
  }
  const handleShow = () => {
    setModalShow(true)
    setForm({
      recipeName: "",
      recipeDesc: "",
      recipeIngredients: [],
      recipeSteps: []
    })
  };

  const SendMessage = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (token) {
      const parts = token.split('.');
      const decodedToken = base64.decode(parts[1]);
      var mesUser = JSON.parse(decodedToken);
    }
    else {
      window.location.href = "/login";
    }
    if (mesUser.userEmail === toUser) {
      alert("This is your recipe");
      return;
    }
   
    const data = await fetch(API_BASE + "/message/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userEmail: mesUser.userEmail,
        toUser: toUser,
        messages:[{
          userEmail:mesUser.userEmail,
          toUser:toUser,
        }]
      })
    }).then(res => res.json());
    setMessages([...messages, data]);
    handleClose();
  }

  const AddRecipe = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (token) {
      const parts = token.split('.');
      const decodedToken = base64.decode(parts[1]);
      var user = JSON.parse(decodedToken);
    }
    else {
      window.location.href = "/login";
    }
    if (!user.userEmail || !form.recipeName || !form.recipeDesc || !form.recipeIngredients || !form.recipeSteps) {
      alert("please fill out all fields")
      return
    }
    const data = await fetch(API_BASE + "/recipe/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userEmail: user.userEmail,
        recipeName: form.recipeName,
        recipeDesc: form.recipeDesc,
        recipeIngredients: form.recipeIngredients,
        recipeSteps: form.recipeSteps
      })
    }).then(res => res.json());

    setRecipes([...recipes, data]);
    setForm({
      recipeName: "",
      recipeDesc: "",
      recipeIngredients: [],
      recipeSteps: []
    })
  }

  const handleIngredient = (e, i) => {
    const ingredientsClone = [...form.recipeIngredients]

    ingredientsClone[i] = e.target.value

    setForm({
      ...form,
      recipeIngredients: ingredientsClone
    })
  }

  const handleIngredientCount = () => {
    setForm({
      ...form,
      recipeIngredients: [...form.recipeIngredients, ""]
    })
  }

  const handleStep = (e, i) => {
    const stepsClone = [...form.recipeSteps]

    stepsClone[i] = e.target.value

    setForm({
      ...form,
      recipeSteps: stepsClone
    })
  }

  const handleStepCount = () => {
    setForm({
      ...form,
      recipeSteps: [...form.recipeSteps, ""]
    })
  }



  return (
    <div>
      <Modal show={modalShowM}>
        <Modal.Header>
          <h2>Create A New Message</h2>
          <Button variant="danger" size="lg" type="button" onClick={handleClose}>Close</Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={SendMessage}>
            <Form.Group controlId="messageControl">
              <Form.Control
                maxlength="65"
                type="text"
                placeholder="Enter message"
                required
                value={msg+" "+toUser}
              />
              <hr />
              <Stack gap={3} >
                <Button variant="primary" size="lg" type="submit">Send</Button>
              </Stack>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={modalShow} >
        <Modal.Header>
          <h2>Create a new recipe</h2>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={AddRecipe}>
            <Form.Group className="mb-3" controlId="formGroupName">
              <Form.Label>Recipe Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                required
                value={form.recipeName}
                onChange={e => setForm({ ...form, recipeName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupDesc">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                required
                value={form.recipeDesc}
                onChange={e => setForm({ ...form, recipeDesc: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupIngredients">
              <Form.Label>Ingredients</Form.Label>
              {form.recipeIngredients.map((ingredient, i) => (
                <Form.Control
                  type="text"
                  placeholder="Enter An Ingredient"
                  required
                  key={i}
                  value={ingredient}
                  onChange={e => handleIngredient(e, i)} />
              ))
              }
              <Stack gap={3}>
                <Button type='button' variant="success" onClick={handleIngredientCount}>Add An Ingredient</Button>
              </Stack>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupSteps">
              <Form.Label>Steps</Form.Label>
              {form.recipeSteps.map((step, i) => (
                <Form.Control
                  type="text"
                  placeholder="Enter A Step"
                  required
                  key={i}
                  value={step}
                  onChange={e => handleStep(e, i)} />
              ))
              }
              <Stack gap={3}>
                <Button type="button" variant="success" onClick={handleStepCount}>Add A Step</Button>
              </Stack>
            </Form.Group>
            <hr />
            <Stack gap={3} >
              <Button variant="primary" size="lg" type="submit">Add A Recipe</Button>
              <Button variant="danger" size="lg" type="button" onClick={handleClose}>Close</Button>
            </Stack>
          </Form>
        </Modal.Body>
      </Modal>
      <Stack gap={3}>
        <Button variant="primary" onClick={handleShow}>
          Create A New Recipe
        </Button>
      </Stack>
      <Row className='p-1'>
        <Col className='col-sm-12 col-md-12 col-lg-12 col-xl-12 mx-auto my-1'>
          <Row className='row-cols-1 row-cols-xl-1'>
            {
              recipes.length > 0 ? recipes.map(recipe => (
                <Col className='mb-1' key={recipe._id}>
                  <Card className="bg-dark text-white">
                    <Card.Header>
                      <h1 >{recipe.recipeName}</h1>
                    </Card.Header>
                    <hr></hr>
                    <Card.Body>
                      <Card.Text>
                        <h3>Description</h3>
                        <hr></hr>
                        <p className="bg-white text-dark" dangerouslySetInnerHTML={{ __html: recipe.recipeDesc }}></p>
                      </Card.Text>
                      <Card.Text>
                        <h3>Ingredients</h3>
                        <hr></hr>
                        <ListGroup variant="flush">
                          {recipe.recipeIngredients.map((ingredient, i) => (
                            <ListGroup.Item key={i}>{ingredient}</ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Card.Text>
                      <Card.Text>
                        <h3>Steps</h3>
                        <hr></hr>
                        <ListGroup variant="flush">
                          {recipe.recipeSteps.map((step, i) => (
                            <ListGroup.Item key={i}>{step}</ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Card.Text>
                    </Card.Body>
                    <ButtonGroup className="ms-2  me-2">
                      <Button
                        variant="outline-primary"
                        type='button'
                        onClick={e => msgIdCont(e, recipe.userEmail)}>Say Hello</Button>
                    </ButtonGroup>
                    <hr />
                  </Card >
                </Col>
              )) : (
                <div>
                  <p>No recipes in database</p>
                </div>
              )
            }
          </Row>
        </Col>
      </Row>
    </div >
  );
}

export default Recipes;
