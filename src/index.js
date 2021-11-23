require("dotenv").config();
const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth")
const fs = require("fs");
const Filter = require("bad-words");
const { generateMessage } = require("../src/utils/messages");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./utils/chat-users");


const app = express();
const port = process.env.PORT || 3000;

// Chat
// websockets rrun on http protocol. thats why we require
const http = require("http");
// then we create a neww http server and parse express app to it
// det sker behind the scenes, men så får vi ikke adgang til den rå server
// som socketio() forventer. derfor laver vi vores egen http server her
const server = http.createServer(app);
const socketio = require("socket.io");
// here we create a new socket.io instance and configure it to work with server
const io = socketio(server);

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const login = fs.readFileSync(__dirname + "/public/login/login.html", "utf-8");
const register = fs.readFileSync(__dirname + "/public/register/register.html", "utf-8");
const frontpage = fs.readFileSync(__dirname + "/public/frontpage/frontpage.html", "utf-8");
const navbar = fs.readFileSync(__dirname + "/public/navbar/navbar2.html", "utf-8");
const footer = fs.readFileSync(__dirname + "/public/footer/footer.html", "utf-8");
const message = fs.readFileSync(__dirname + "/public/messages/message.html", "utf-8");

const chat = fs.readFileSync(__dirname + "/public/chat/join.html", "utf-8");
const chat2 = fs.readFileSync(__dirname + "/public/chat/chat2.html", "utf-8");
const fretboard = fs.readFileSync(__dirname + "/public/fretboard/board.html", "utf-8");
const tuner = fs.readFileSync(__dirname + "/public/tuner/tuner.html", "utf-8");
const bands = fs.readFileSync(__dirname + "/public/bands/bands.html", "utf-8");


const a_chords = fs.readFileSync(__dirname + "/public/chords/a_chords.html", "utf-8");
const b_chords = fs.readFileSync(__dirname + "/public/chords/b_chords.html", "utf-8");
const c_chords = fs.readFileSync(__dirname + "/public/chords/c_chords.html", "utf-8");
const d_chords = fs.readFileSync(__dirname + "/public/chords/d_chords.html", "utf-8");
const e_chords = fs.readFileSync(__dirname + "/public/chords/e_chords.html", "utf-8");
const f_chords = fs.readFileSync(__dirname + "/public/chords/f_chords.html", "utf-8");
const g_chords = fs.readFileSync(__dirname + "/public/chords/g_chords.html", "utf-8");

// Chat
// socket er et object der indeholder information om den nye forbindelse og vi kan bruge metoder på socket for at 
// kommunikere med den specifikke client
io.on("connection", (socket) => {
    console.log("New socket connection")

    // her bruger vi spread operator og har et options argument der indeholder username og room på brugeren fra addUser
    socket.on("join", (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options });

        if (error) {
            return callback(error)
        }

        socket.join(user.room);


        io.to(user.room).emit("updatedUserList", getUsersInRoom(user.room));
        socket.emit("message", generateMessage("Admin - " + "Welcome to the chat").text);
        socket.broadcast.to(user.room).emit("message", generateMessage("Admin - " + `${user.username} has joined`).text);

        // io.to(user.room).emit("roomData", {
        //     room: user.room,
        //     users: getUsersInRoom(user.room)
        // });

        callback();
    });

    // the callback aknowledges the event and when called make sure the aknowledgement in chat2.js is sendt
    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id);
        const filter = new Filter();

        if (filter.isProfane(message)) {
            socket.emit("message", generateMessage("Admin - " + "No foul language").text);
            return callback("Foul language not allowed! Please behave yourself")
        };

        io.to(user.room).emit("message", generateMessage(user.username + " - " + message).text);
        callback();
    });

    socket.on("disconnect", () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit("message", generateMessage("Admin - " + `${user.username} has left!`).text);
            io.to(user.room).emit("updateUserList", {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        };
    });
});



// Routes
app.get("/", (req, res) => {
    res.send(login + footer)
});

app.get("/register", (req, res) => {
    res.send(register + footer)
});

app.get("/frontpage", auth, (req, res) => {
    res.send(navbar + frontpage + footer);
});

app.get("/message", auth, (req, res) => {
    res.send(navbar + message + footer);
});

app.get("/bands", auth, (req, res) => {
    res.send(navbar + bands + footer);
});


app.get("/chat", auth, (req, res) => {
    res.send(chat);
});

app.get("/chat2", auth, (req, res) => {
    res.send(chat2);
});

app.get("/fretboard", auth, (req, res) => {
    res.send(navbar + fretboard + footer);
});

app.get("/tuner", auth, (req, res) => {
    res.send(navbar + tuner + footer);
});

// Chord routes
app.get("/a_chords", (req, res) => {
    res.send(navbar + a_chords + footer)
});

app.get("/b_chords", (req, res) => {
    res.send(navbar + b_chords + footer)
});

app.get("/c_chords", (req, res) => {
    res.send(navbar + c_chords + footer)
});

app.get("/d_chords", (req, res) => {
    res.send(navbar + d_chords + footer)
});

app.get("/e_chords", (req, res) => {
    res.send(navbar + e_chords + footer)
});

app.get("/f_chords", (req, res) => {
    res.send(navbar + f_chords + footer)
});

app.get("/g_chords", (req, res) => {
    res.send(navbar + g_chords + footer)
});

// here we call server.listen to start our http server
server.listen(port, (error) => {
    if (error) {
        console.log("Could not connect to server", error)
    }
    console.log(`Server is up on port: ${port}`)
});

