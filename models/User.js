import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import  jwt  from "jsonwebtoken";

const nameValidator = {
    validator: function(v) {
      return /^[a-z ,.'-]+$/i.test(v);
    },
    message: props => `${props.value} is not a valid name!`
}


const UserSchema = new mongoose.Schema({
  firstName : {
    type: String,
    required: [true, 'First name is required'],
    min: 2,
    max : 50,
    validate: nameValidator,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    min: 2,
    max : 50,
    validate: nameValidator,
  },
  email : {
    type: String,
    required: [true, 'email is required'],
    max : 50,
    unique: true,
    validate: {
      validator: function(v){
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  password : {
    type: String,
    required : [true,'password is required'],
    min: 8
  },
  picturePath: {
    type: String,
    default: "",
  },
  follows: {
    type: Array,
    default: []
  },
  location: String,
  occupation: String,
  viewedProfile: Number,
  impressions: Number,
  
}, {timestamps: true});



UserSchema.pre('save', async function(next){
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password,salt);
  next();
})

UserSchema.methods.comparePassword = async function(userTypedPassword){
  const isMatch = await bcrypt.compare(userTypedPassword,this.password);
  return isMatch;
}

UserSchema.methods.generateToken = function(){
  return jwt.sign({userId : this._id},process.env.JWT_SECRET)
}



// to make it so when a user is deleted it removes him from other users follows
UserSchema.pre('remove', async function (next) {
  try {
    // Find all users that have this user in their follows array
    const users = await this.model('User').find({ follows: this._id });

    // Remove the user's ID from the follows array of each user
    await Promise.all(users.map(user => {
      user.follows.pull(this._id);
      return user.save();
    }));

    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model('User', UserSchema);
export default User;