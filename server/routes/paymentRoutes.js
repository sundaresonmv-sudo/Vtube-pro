const express = require("express")

const Razorpay = require("razorpay")

const User = require("../models/user")

const router = express.Router()

const razorpay = new Razorpay({

  key_id: process.env.RAZORPAY_KEY_ID,

  key_secret: process.env.RAZORPAY_KEY_SECRET

})


// ================= CREATE ORDER =================

router.post(
  "/create-order",
  async (req, res) => {

    try {

      const options = {

        amount:
          req.body.amount * 100,

        currency: "INR",

        receipt: "receipt_order"

      }

      const order =
        await razorpay.orders.create(
          options
        )

      res.json(order)

    } catch (error) {

      console.log(error)

    }

  }
)


// ================= UPDATE PLAN =================

router.put(
  "/update-plan",
  async (req, res) => {

    try {

      const {
        userId,
        plan
      } = req.body

      await User.findByIdAndUpdate(
        userId,
        {
          plan,

          isPremium:
            plan !== "free"
        }
      )

      res.json({
        msg: "Plan Updated"
      })

    } catch (error) {

      console.log(error)

    }

  }
)

module.exports = router