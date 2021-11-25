const express = require("express")
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
        console.log(user, token)
        res.status(201).redirect("/")
    } catch (e) {
        res.status(400).send(e)
    }
})

// login
router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)

        const token = await user.generateAuthToken()
        console.log(user)
        res.cookie('auth_token', token, { maxAge: 21600000 })
        res.redirect("/frontpage")
    } catch (e) {
        res.status(400).send(`<div style="background-color: red; text-align: center"><h1> Wrong credentials - Did you register...?</h1> <a href='/'><h2 style="color: black"> Try again please </h2></a> <a href='/register'><h2 style="color: black"> Register </h2></a><p> ${e} </p></div>`)

    }
})

// logout
router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()


        res.send();
    } catch (e) {
        res.status(500).send()
    }
})

router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
        res.redirect("/login");
    } catch (e) {
        res.status(500).send()
    }
});


module.exports = router