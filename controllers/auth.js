import User from '../models/User.js';
import {StatusCodes} from 'http-status-codes';
import {BadRequestError, UnauthenticatedError} from '../errors/index.js';
const register = async (req,res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    picturePath,
    location,
    occupation,
  } = req.body;

  const newUser = new User({
    firstName,
    lastName,
    email,
    password,
    picturePath,
    location,
    occupation
  });

  const savedUser = await newUser.save();

  if(!savedUser){
    throw new BadRequestError("invalid input");
  }

  res.status(StatusCodes.CREATED).json(savedUser);
}
const login = async (req,res) => {
  const {email, password} = req.body;
  
  if(!email || !password){
    throw new BadRequestError("Email and password must be enterd");
  }

  const user = await User.findOne({email});

  if(!user){
    throw new BadRequestError('user doesnt exist');
  }

  const isMatch = await user.comparePassword(password);
  
  if(!isMatch){
    throw new UnauthenticatedError('invalid credentials')
  }

  const token = user.generateToken();

  delete user.password;
  res.status(StatusCodes.OK).json({token, user})
}





export {login,register};