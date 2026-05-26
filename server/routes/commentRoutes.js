const express = require("express")

const router = express.Router()

const Comment = require("../models/comment")


// ================= ADD COMMENT =================

router.post("/add", async (req, res) => {

  try {

    const {
      userId,
      userName,
      city,
      text
    } = req.body

    // block special characters
    const regex = /^[^@#$%^&*()!]+$/;

    if (!regex.test(text)) {

      return res.status(400).json({
        msg: "Special characters not allowed"
      })

    }

    const newComment = new Comment({
      userId,
      userName,
      city,
      text
    })

    await newComment.save()

    res.json({
      msg: "Comment Added"
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      msg: "Server Error"
    })

  }

})


// ================= GET COMMENTS =================

router.get("/", async (req, res) => {

  try {

    const comments = await Comment.find()

    res.json(comments)

  } catch (error) {

    console.log(error)

  }

})


// ================= LIKE COMMENT =================

router.put("/like/:id", async (req, res) => {

  try {

    const comment = await Comment.findById(req.params.id)

    comment.likes += 1

    await comment.save()

    res.json({
      msg: "Liked"
    })

  } catch (error) {

    console.log(error)

  }

})


// ================= DISLIKE COMMENT =================

router.put("/dislike/:id", async (req, res) => {

  try {

    const comment = await Comment.findById(req.params.id)

    comment.dislikes += 1

    // auto delete after 2 dislikes
    if (comment.dislikes >= 2) {

      await Comment.findByIdAndDelete(
        req.params.id
      )

      return res.json({
        msg: "Comment deleted"
      })

    }

    await comment.save()

    res.json({
      msg: "Disliked"
    })

  } catch (error) {

    console.log(error)

  }

})


// ================= EXPORT =================

module.exports = router