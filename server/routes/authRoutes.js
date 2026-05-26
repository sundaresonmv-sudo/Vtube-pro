const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const router = express.Router()

const User = require("../models/user")

router.post("/register", async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      city,
      state,
      mobile
    } = req.body

    // check existing user
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        msg: "User already exists"
      })
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
      state,
      city
    })

    await newUser.save()

    res.json({
      msg: "User Registered Successfully"
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      msg: "Server Error"
    })

  }

})

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body

    // find user
    const user = await User.findOne({ email })

    if (!user) {

      return res.status(400).json({
        msg: "User not found"
      })

    }

    // compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!isMatch) {

      return res.status(400).json({
        msg: "Invalid password"
      })

    }

    // create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({
      msg: "Login Successful",
      token,
      user
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      msg: "Server Error"
    })

  }

})


module.exports = router