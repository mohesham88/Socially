import User from "../models/User.js";
import Post from "../models/post.js"
import {BadRequestError, NotFoundError} from '../errors/index.js'
import { StatusCodes } from "http-status-codes";



export const createPost = async (req,res) =>{
  const {description, picturePath} = req.body;

  const {userId} = req.user;

  // console.log(path.join(__dirname, '..', 'public' , 'assets' , userId , req.file.originalName));
  console.log(path.join('..', 'public' , 'assets' , userId , req.file.originalName));

  const user = await User.findById(userId);
  const newPost = await Post.create({
    userId,
    location: user.location,
    description,
    picturePath,
  })

  if(!newPost){
    throw new BadRequestError("Invalid Creditentials");
  }




  res.status(StatusCodes.CREATED).json(newPost);

} 

export const getFeedPosts = async (req,res) =>{
  const posts = await Post.find();

  res.status(StatusCodes.OK).json(posts);
}

export const likePost = async (req,res) =>{
  
  const {user  : {userId}, params : {postId}} = req;

  const post = await Post.findById(postId);

  if(!post){
    throw new NotFoundError("Post doesn't exist")
  }

  const userLikeStatus = post.likes.get(userId);


  if(userLikeStatus){
    post.likes.delete(userId); // delete the user from the map 
  }else{
    post.likes.set(userId, true);
  }


  const updatedPost = await Post.findByIdAndUpdate(
    postId, 
    {
      likes : post.likes,
    }, {new: true}
  )

  res.status(StatusCodes.OK).json({like : !userLikeStatus});

}

export const getUserPosts = async (req,res) =>{
  const {userId} = req.params;
  const posts = await Post.find({userId})

  if(!posts) {
    throw new NotFoundError("User doesn't exist");
  }

  res.status(StatusCodes.OK).json(posts)
}