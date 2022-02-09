const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt=require('bcrypt')

const UserSchema = new Schema({
	userName:{
        type:String,
        required:true
    },
	userEmail: {
		type: String,
		required:true, 
        unique:true
	},
	userPassword: {
		type: String,
		required:true
	}
});

UserSchema.pre('save', async function (next){
	try {
		const salt=await bcrypt.genSalt(10);
		const hashedPassword=await bcrypt.hash(this.userPassword,salt)
		this.userPassword=hashedPassword
		next()
		//console.log("called before saving a user")
	} catch (error) {
		next(error)
	}
})


const User = mongoose.model("User", UserSchema);

module.exports = User;