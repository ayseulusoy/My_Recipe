const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
    userEmail: {
        type: String,
    },
	recipeName:{
        type:String,
        required:true
    },
	recipeDesc: {
		type: String,
		required:true,
	},
	recipeIngredients:{
        type:Array,
        required:true
    },
    recipeSteps:{
        type:Array,
        required:true
    }
});

const Recipe = mongoose.model("Recipe", RecipeSchema);

module.exports = Recipe;