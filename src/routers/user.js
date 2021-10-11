const express = require("express")
const multer = require("multer")
const sharp = require("sharp")
const User = require("../models/user")
const auth = require("../middleware/auth")
const bodyParser = require('body-parser');
const router = new express.Router()
router.use(bodyParser.urlencoded({ extended: true }));


// create user
router.post("/users", async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).redirect("/")
    } catch (e) {
        res.status(400).send(e)
    }
})

// login
router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        //
        const token = await user.generateAuthToken()
        res.cookie('auth_token', token, { maxAge: 21600000 })
        res.redirect("/frontpage")
    } catch (e) {
        res.status(400).redirect("/")

    }
})

// logout
router.post("/users/logout", async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        // res.send()
        res.clearCookie("auth_token").redirect("/login");
    } catch (e) {
        res.status(500).send()
    }
})

router.post("/users/logoutAll", async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
        res.redirect("/login");
    } catch (e) {
        res.status(500).send()
    }
})

router.get("/users/me", (req, res) => {
    res.send(req.user)
})

router.post("/users/me", async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "email", "password", "age"]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete("/users/me", async (req, res) => {
    try {
        await req.user.remove()

        res.send(req.user).redirect("/")
    } catch (e) {
        res.status(500).send()
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(reg, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Please upload an image"))
        }
        cb(undefined, true)
    }
})


module.exports = router