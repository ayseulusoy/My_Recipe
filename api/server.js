//mongodb://127.0.0.1:27017/
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express()

app.use(express.json());
app.use(cors());

const DB = require('./models/db');
const User = require('./models/user');
const Recipe = require('./models/recipes');
const Message=require('./models/messages');

app.get('/users', async (req, res) => {
  const users = await User.find();

  res.json(users);
})

app.post('/user/new', (req, res) => {
  const user = new User({
    userName: req.body.userName,
    userEmail: req.body.userEmail,
    userPassword: req.body.userPassword
  })

  user.save();

  res.json(user);
})

app.post('/user/login', async (req, res) => {
  const user = await User.findOne({
    userEmail: req.body.userEmail,
  }).then(user => {
    if (!user) {
      return { status: 'error', error: 'Invalid Login' }
    }
    bcrypt.compare(req.body.userPassword, user.userPassword, (err, result) => {
      if (result) {
        const token = jwt.sign({
          userName: user.userName,
          userEmail: user.userEmail,
        }, 'secret123')

        return res.json({ status: 'ok', user: token })

      } else {
        return res.json({ staus: 'error', user: false })
      }
    })
  })
})

app.get('/recipes', async (req, res) => {
  const recipes = await Recipe.find();

  res.json(recipes);
})

app.post('/recipe/new', (req, res) => {
  const recipe = new Recipe({
    userEmail: req.body.userEmail,
    recipeName: req.body.recipeName,
    recipeDesc: req.body.recipeDesc,
    recipeIngredients: req.body.recipeIngredients,
    recipeSteps: req.body.recipeSteps
  })

  recipe.save();

  res.json(recipe);
})

app.get('/messages/:userEmail', async (req, res) => {
  await Message.find({ $or: [{ userEmail: req.params.userEmail }, { toUser: req.params.userEmail }] }
    , (error, data) => {
      if (error) {
        console.log("Messages error");
      } else {
        console.log(data);
        res.json(data)
      }
    }).clone()
})

app.post('/messages/addAMesssage/:id',async (req,res) =>{
  let newMessage = {
    userEmail:req.body.userEmail,
    toUser:req.body.toUser,
    mes:req.body.mes
  }
  let result = await Message.findById(req.params.id);
  result.messages.push(newMessage);
  await result.save();
  res.json(result);
})

app.post('/messages/msgIdCont/:userEmail',async (req,res) =>{
  let result1 = await Message.findOne({ $and: [{ userEmail: req.body.userEmail }, { toUser: req.body.toUser }] });
  let result2 = await Message.findOne({ $and: [{ userEmail: req.body.toUser }, { toUser: req.body.userEmail }] });
  console.log(result2);
  console.log(result1);
  if(result1 === null && result2 === null){
    res.json(true);
  }
  else{
    res.json(false);
  }
})

app.post('/message/new', (req, res) => {
  console.log(req.body.mes);
  const message = new Message({
    userEmail: req.body.userEmail,
    toUser:req.body.toUser,
    messages: [{
      userEmail:req.body.userEmail,
      toUser:req.body.toUser,
      mes:'Hello',
    }]
  })
  message.save();
  res.json(message);
})

app.listen(3001, () => console.log("Server started on port 3001"));