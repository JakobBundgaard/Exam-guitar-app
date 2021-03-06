const express = require("express")
const Task = require("../models/task")
const auth = require("../middleware/auth")
const router = new express.Router()
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/tasks", async (req, res) => {
    const task = new Task({
        ...req.body,
    })

    try {
        await task.save()
        res.status(201).redirect("/message")
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/resource", async (req, res) => {

    try {

        var bands = ["Bring Back the plaque - Cattle Decapitation", "the Sleep - Pantera", " Pneuma - Tool"]

        var resource = new Object();

        resource.bands = bands;

        var json = JSON.stringify(resource);

        res.send(json)
    } catch (e) {
        res.status(500).send()
    }
})

router.get("/tasks", async (req, res) => {
    try {
        const task = await Task.find()


        if (!task) {
            return res.status(404).send()
        }

        res.send(task.reverse())


    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router