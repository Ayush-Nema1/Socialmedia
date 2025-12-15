import User from "../models/user.model.js"
import Profile from "../models/profile.model.js"
import Post from "../models/posts.model.js"
import bcrypt from "bcrypt";

export const createPost = async(req,res)=>{
    const {token} = req.body;

    try {
        const user = await User.findOne({token});
    if(!user){
      return res.status(404).json({message:"User not found"});
    }

    const post = new Post({
        userId:user._id,
        body:req.body.body,
        media: req.file != undefined ? req.file.filename:"",
        fileType:req.file != undefined ? req.file.mimetype.split("/")[1]:""
    })
        await post.save();
        return res.json({message: "Post successfully"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const getAllPosts = async(req,res)=>{
try {
    const post = await Post.find().populate('userId','name username email profilePicture');
    return res.json({post});
} catch (error) {
    return res.status(500).json({message:error.message});
}
}

export const deletePost = async(req,res)=>{
    const {token,post_id} = req.body;
    try {
        const user = await User.findOne({token}).select("id");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const post  = await Post.findOne({_id:post_id});
        if(!post){
            return res.status(404).json({message: "Post not found"})
        }
        if(post.userId.toString() !== user._id.toString()){
            return res.status(401).json({message: "Unauthorized access"});
        }
        await Post.deleteOne({_id: post_id});
        return res.json({message: "Post Deleted"})
    } catch (error) {
    return res.status(500).json({message:error.message});
    }
}
export const commentPost = async (req,res)=>{
  const {token,post_id,commentbody} = req.body;
  try{
  const user = await User.findOne({token}).select("_id");
  if(!user){
      return res.status(404).json({message:"User not found"});
    }
    const post = await Post.findOne({
      _id:post_id
    });
  if(!post){
    return res.status(404).json({message: "Posts not found"});
  }
  const comment = new Comment({
    userId : user._id,
    postId : post_id,
    comment : commentbody
  })
  await comment.save();
  return res.status(200).json({message: "comment on post successfully"});
  }catch (error) {
     return res.status(500).json({ message: error.message });
    }
}

export const get_comment_by_post = async(req,res)=>{
  const {post_id} = req.body;
  try {
    const post = await Post.findOne({_id : post_id});

    if(!post){
      return res.status(404).json({message: "Posts not found"});
    }
      
    const comments = await Comment.find({ postId: post_id })
      .populate('userId', 'name username profilePicture');

    return res.json({ comments });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const delete_comment_of_user = async(req,res)=>{
  const {token ,comment_id} = req.body;
  try {
    const user = await User.findOne({token}).select("_id");
      if(!user){
      return res.status(404).json({message:"User not found"});
    }
     const comment = await Comment.find({ "_id": comment_id })

     if(!comment){
       return res.status(404).json({message: "comment not found"});
     } 
     if(comment.userId.toString() !== user._id.toString()){
      return res.status(401).json({message: "unauthorized access"});
     }
      await Comment.deleteOne({"_id": comment_id});
      return res.json({message: "Comment deleted"});

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
export const increment_like = async(req,res)=>{
  const {post_id} = req.body;
  try {
    const post  = await Post.findOne({post_id});
    if(!post){
      return res.status(404).json({messag: "Post not found"});
    }
    post.likes = post.likes+1;
    await post.save();
    return res.status(200).json({message:"liked"})
  } catch (error) {
      return res.status(500).json({ message: error.message });
  }
}
