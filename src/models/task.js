const mongoose = require("mongoose")
const validator = require("validator")

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "User" // same as User from userModel line 103
    }
}, {
    timestamps: true
})

const Task = mongoose.model("Task", taskSchema)



module.exports = Task