const express = require("express")

const router = express.Router()

const Download =
  require("../models/Download")

const User =
  require("../models/user")


// ================= DOWNLOAD VIDEO =================

router.post(
  "/download",
  async (req, res) => {

    try {

      const {
        userId,
        videoTitle,
        videoUrl
      } = req.body

      const user =
        await User.findById(userId)

      // free users only 1/day
      if (
        user.plan === "free"
      ) {

        const today =
          new Date()

        today.setHours(
          0, 0, 0, 0
        )

        const count =
          await Download.countDocuments({

            userId,

            downloadedAt: {
              $gte: today
            }

          })

        if (count >= 1) {

          return res.status(400).json({

            msg:
              "Free users can only download 1 video daily"

          })

        }

      }

      // save download
      const newDownload =
        new Download({

          userId,

          videoTitle,

          videoUrl

        })

      await newDownload.save()

      res.json({
        msg: "Download Saved"
      })

    } catch (error) {

      console.log(error)

      res.status(500).json({
        msg: "Server Error"
      })

    }

  }
)


// ================= GET DOWNLOADS =================

router.get(
  "/:userId",
  async (req, res) => {

    try {

      const downloads =
        await Download.find({

          userId:
            req.params.userId

        })

      res.json(downloads)

    } catch (error) {

      console.log(error)

    }

  }
)

module.exports = router