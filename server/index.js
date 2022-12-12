import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import mongoose from "mongoose"
import bcrypt from "bcrypt"

import User from "./model/user.js"
import Schedule from "./model/schedule.js"

import "dotenv/config"

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
const jsonParser = bodyParser.json()

const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGODB, {}).then(() => {
    console.log('Connected to MongoDB')
}).catch(err => {
    console.log(err)
})

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.post("/signup", jsonParser, (req, res) => {
    const { name, email, password, dob } = req.body

    const user = new User({ name, email, password, dob })

    user.save().then(user => {
        res.send({ message: true, user: user })
    }).catch(err => {
        console.log(err)
        res.send({ error: "SignUp failed" })
    })
})

app.post("/login", jsonParser, async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email: email })

    if (user && user.password) {
        bcrypt.compare(password, user.password, function (err, result) {
            if (err) {
                console.log(err)
                res.send({ error: err })
            } else {
                delete user.password
                res.send({ message: result, user: user })
            }
        })
    } else {
        res.send({ error: "User not found" })
    }
})

app.post("/getScheduleData", jsonParser, async (req, res) => {
    const { email } = req.body

    const schedule = await Schedule.findOne({
        email: email
    })

    const user = await User.findOne({
        email: email
    })

    if (schedule && schedule.email) {
        schedule.user = user
        res.send({ message: true, schedule: schedule })
    } else {
        Schedule({
            email: email,
            currentMonthBatch: 0
        }).save().then(schedule => {
            schedule.user = user
            res.send({ message: true, schedule: schedule })
        }).catch(err => {
            console.log(err)
            res.send({ error: "Failed to create schedule" })
        })
    }
})

app.post("/payMonth", jsonParser, async (req, res) => {
    const { email } = req.body

    const schedule = await Schedule.findOne({
        email: email
    })

    const user = await User.findOne({
        email: email
    })

    if (schedule && schedule.email) {
        schedule.payedCurrentMonth = true
        schedule.save().then(schedule => {
            schedule.user = user
            res.send({ message: true, schedule: schedule })
        }).catch(err => {
            console.log(err)
            res.send({ error: "Failed to pay month" })
        })
    } else {
        res.send({ error: "Schedule not found" })
    }
})

app.post("/updateBatch", jsonParser, async (req, res) => {
    const { email, batch } = req.body

    const schedule = await Schedule.findOne({
        email: email
    })

    const user = await User.findOne({
        email: email
    })

    if (schedule && schedule.email) {
        schedule.currentMonthBatch = batch
        schedule.save().then(schedule => {
            schedule.user = user
            res.send({ message: true, schedule: schedule })
        }).catch(err => {
            console.log(err)
            res.send({ error: "Failed to pay month" })
        })
    } else {
        res.send({ error: "Schedule not found" })
    }
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})
