import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/index.js";
import User from "../models/User.js";

const getUser = async (req,res) => {
  const userID = req.params.id;
  const user = await User.findById(userID);
  if(!user){
    throw new NotFoundError("user doesn't exist");
  }
  delete user.password;
  res.status(StatusCodes.OK).json(user);
}

const getUserFollows = async (req,res) => {
  const userID = req.params.id;
  const user = await User.findById(userID);
  if(!user){
    throw new NotFoundError("user doesn't exist");
  }
  
  const userFollows = user.follows;
  
  const follows = await Promise.all(
    userFollows.map(followId => {
      return User.findById(followId);
    })
  )
  let formattedFriends = [];
  if(follows.length > 0){
    formattedFriends = follows.map(
      ({_id, firstName, lastName, occupation, location, picturePath}) => {
        return {_id, firstName, lastName, occupation, location, picturePath};
      }
    );
  }
  res.status(StatusCodes.OK).json(formattedFriends);
}
const addRemoveFollow = async (req,res) => {
  const userID = req.params.id;
  const friendAddedOrRemoved = req.params.followId;
  const user = await User.findById(userID);
  if(!user){
    throw new NotFoundError("user doesn't exist");
  }
  const userFollows = user.follows;
  
  if(userFollows.includes(friendAddedOrRemoved)){
    // they are follows
    user.follows = userFollows.filter(followId => followId != friendAddedOrRemoved)
  }else{
    user.follows = [...userFollows, friendAddedOrRemoved];
  }

  const newUser = await user.save();

  const follows = await Promise.all(
    user.follows.map(followId => User.findById(followId))
  )
  
  let formattedFriends = []
  if(follows.length > 0){
    formattedFriends = follows.map(
    ({_id, firstName, lastName, occupation, location, picturePath}) => {
      return {_id, firstName, lastName, occupation, location, picturePath};
    }
    );

  }

  res.status(StatusCodes.OK).json(formattedFriends)


}



export  {
  getUser,
  getUserFollows,
  addRemoveFollow
}