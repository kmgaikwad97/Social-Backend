const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const _ = require('lodash');

router.post("/register", async (req, res) => {
  try {
    // Generate New Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create New User
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // Save User and Return Response
    const user = await newUser.save();
    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "User Created Successfully.",
      data: {
        outputObject: user,
      },
    });
  } catch (err) {
    res.status(400).json({
      statusCode: 400,
      success: false,
      errorMessage: "Failed to Create the User.",
      data: err.message,
    });
  }
});


// Login
router.post("/login", async (req, res) => {
  try {
    console.log(req.body, "asdfasdf");
    const user = await User.findOne({ email: req.body.email });
    // !user && res.status(404).send("User Not Found");
     !user &&
      res.status(404).json({
        statusCode: 404,
        success: false,
        errorMessage: "User Not Found.",
      });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json({
        statusCode: 400,
        success: false,
        errorMessage: "Wrong Password.",
      });

      res.status(200).json({
            statusCode: 200,
            success: true,
            message: "User Login Successfully.",
            data: {
              outputObject: user,
            },
      })
  } catch (err) {
    console.log(err);
    res.status(500).json({
        statusCode: 500,
        errorMessage: err.message,
        success: false
    });
  }
});

module.exports = router;
