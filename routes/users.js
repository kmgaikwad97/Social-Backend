const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

// Update User
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        hashedp = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedp;
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account Has been updated");
    } catch (err) {
      return res.status(500).json(err.message);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});

// Delete User
// router.delete("/:id", async (req, res) => {
//     if (req.body.userId === req.params.id || req.body.isAdmin) {
//         console.log(req.params.id,"asdf-asdf");

//       try {
//         const user = await User.deleteOne(req.params.id);

//         console.log(user,"asdfasdf");
//         res.status(200).json("Account has been deleted");
//       } catch (err) {
//         return res.status(500).json(err);
//       }
//     } else {
//       return res.status(403).json("You can Delete only your account!");
//     }
//   });

router.delete("/:id", async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      statusCode: 200,
      message: `${deleteUser.username} Data Deleted Successfully`,
      success: true,
    });
  } catch (err) {
    res.status(500).send(err);
    console.log("hello");
  }
});

// Get a User
router.get("/:id", async (req, res) => {
  // try{
  //     const _id = req.params.id
  //     const userData = await User.findById(_id);
  //     res.status(200).json({
  //         statusCode:200,
  //         message:`Fetched ${deleteUser.userData}'s Data Successfully`,
  //         success:true,
  //         data:userData
  //     });
  // }
  // catch(err){
  //     res.status(500).send(err)
  //     console.log("hello");
  // }

  try {
    console.log(req.params.id);
    const _id = req.params.id;
    const getThatUser = await User.findById(_id);
    const { password, updatedAt, ...other } = getThatUser._doc;
    res.send(other);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Follow a User
router.put("/:id/follow", async (req, res) => {
    console.log(req.body,"asdf-asdf");
    console.log(req.params,"asdf-asdf");
  if (req.body.userId !== req.params.id) {
    console.log("hello");
    try {
      const _id = req.params.id;
      const user = await User.findById(_id);
      console.log(user,"sdf");

      const user_Id = req.body.userId
      console.log(user_Id);
      const currentUser = await User.findById(user_Id);
      console.log(currentUser, "asda");

      if(!user.followers.includes(req.body.userId)){
          await user.updateOne({$push:{followers:req.body.userId}});
          await currentUser.updateOne({$push:{followings:req.params.id}});

          res.status(200).json("User has been Followed.")
      }else{
          res.status(403).json("You already follow this user")
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  } else {
    res.status(403).json("You Can't Follow Yourself.");
  }
});

// UnFollow a User
router.put("/:id/unfollow", async (req, res) => {
    console.log(req.body,"asdf-asdf");
    console.log(req.params,"asdf-asdf");
  if (req.body.userId !== req.params.id) {
    console.log("hello");
    try {
      const _id = req.params.id;
      const user = await User.findById(_id);
      console.log(user,"sdf");

      const user_Id = req.body.userId
      console.log(user_Id);
      const currentUser = await User.findById(user_Id);
      console.log(currentUser, "asda");

      if(user.followers.includes(req.body.userId)){
          await user.updateOne({$pull:{followers:req.body.userId}});
          await currentUser.updateOne({$pull:{followings:req.params.id}});

          res.status(200).json("User has been Unfollowed.")
      }else{
          res.status(403).json("You Don't follow this user")
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  } else {
    res.status(403).json("You Can't Unfollow Yourself.");
  }
});

module.exports = router;
