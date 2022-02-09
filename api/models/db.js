var mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/my-recipe",{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=> console.log("Connected to DB")).catch(console.error);