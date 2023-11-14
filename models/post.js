import mongoose, { Schema }  from "mongoose";


const PostSchema = new mongoose.Schema({
  userId : {
    type: Schema.Types.ObjectId,
    ref : 'User',
  },
  description : {
    type : String,
    required: [true, 'Please Provide a descritpion for you post']
  },
  location: String,
  picturePath : String,
  likes : {
    type: Map,
    of: Boolean,
    default: {}
  },
  comments : {
    type : [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      content: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    default: []
  }

}, {timestamps: true})



export default mongoose.model('Posts', PostSchema);