const Post = require("../models/Post");
const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

// Create a Post

router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Post Created Successfully.",
      data: {
        outputObject: savedPost,
      },
    });
  } catch (err) {
    res.status(500).json({
        statusCode: 400,
        success: false,
        errorMessage: "Failed to Create the Post.",
        data: err.message,
    });
  }
});



// update a post

router.put("/:id",async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        console.log(post,"posted data");
    if(post.userId === req.body.userId){
        await post.updateOne({$set:req.body});
        res.status(200).json("The post has been updated")
    }else{
        console.log("hello");
        res.status(403).json("You can update only YOUR post")
    }   
    }catch(err){
        res.status(500).json(err);
    }
})


// delee a post

router.delete("/:id",async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        console.log(post,"posted data");
    if(post.userId === req.body.userId){
        await post.deleteOne();
        res.status(200).json("The post has been Deleted")
    }else{
        console.log("hello");
        res.status(403).json("You can Delete only YOUR post")
    }   
    }catch(err){
        res.status(500).json(err);
    }
})


// like a post

router.put("/:id/like",async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}});
            res.status(200).json("The post has been liked ")
        }else{
            await post.updateOne({$pull:{
                likes:req.body
            }});
            res.status(200).json("The post has been Disliked")
        }
    }
    catch(err){
        res.status(500).json(err.message);
    }
})

// get a post

router.get("/:id",async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).send(post);
    }catch(err){
        res.status(500).json(err.message);
    }
})


// get timeline posts

router.get("/timeline/all",async(req,res)=>{
    try{
        console.log(req.body.userId);
        const _id = req.body.userId
        const currentUser = await User.findById(_id);
        console.log("hello");
        console.log(currentUser,"asdf");
        const userPosts = await Post.find({ userId:currentUser._id})

        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId)=>{
               return Post.find({userId:friendId});
            })
        );
        res.json(userPosts.concat(...friendPosts))
    }catch(err){
        res.status(500).json(err.message);
    }
})
module.exports = router;
