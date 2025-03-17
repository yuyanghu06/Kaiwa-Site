/**
 * Basic implementation of Kaiwa's Backend
 * @author Yuyang Hu
 * @author Isaac Zhang
 * TODO: Switch to Moongoose for database, implement matching algorithim, implement deserialization system for logins
 */
const express = require('express');
const session = require('express-session');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Account_Student = require('./public/accounts/account_scripts/account_class_student.js');
const Account_Teacher = require('./public/accounts/account_scripts/account_class_teacher.js');
const app = express();
const port = 25565;
const server = http.createServer(app);
const io = socketIo(server, {
    transports : ['websocket'],
});

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(session({
    secret : 'testing-key',
    resave : false,
    saveUninitialized: false,
    store: new session.MemoryStore,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }
}));
app.use(passport.initialize());
app.use(passport.session());
teachers = [];
students = [];

//PASSPORT ACCOUNT LOGIN VERIFICATION STRATEGIES
passport.use("student-local", new LocalStrategy(
    (username, password, done)=>{
        try{
            for(i = 0; i < students.length; i++){
                if(students[i].username === username && students[i].password === password){
                    const student_temp = students[i];
                    console.log(student_temp.username + " " + student_temp.email);
                    return done(null, student_temp);
                }
            }
            return done(null, false, {message : "Error, incorrect username or password"});
        }
        catch(err){
            return done(err);
        }
    } 
))

passport.use("teacher-local", new LocalStrategy(
    async(username, password, done)=>{
        try{
            for(i = 0; i < teachers.length; i++){
                if(teachers[i].username === username && teachers[i].password === password){
                    const teacher_temp = teachers[i];
                    return done(null, teacher_temp);
                }
            }
            return done(null, false, {message : "Error, incorrect username or password"});
        }
        catch(err){
            return done(err);
        }
    }
))

passport.serializeUser((user, done)=>{
    const storage = {
        username : user.username,
        type : user instanceof Account_Student ? "student" : user instanceof Account_Teacher ? "teacher" : "unknown",
    };
    done(null, storage);
})

passport.deserializeUser((user, done) => {
    if (user.type === "student") {
        const student = students.find(s => s.username === user.username);
        return done(null, student || false);
    } else if (user.type === "teacher") {
        const teacher = teachers.find(t => t.username === user.username);
        return done(null, teacher || false);
    }
    return done(null, false);
});

function isAuthenticated(req, res, next){
    console.log(req.user);
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("accounts/login/account_login.html")
}
//PASSPORT LOGIN CODE
app.post('/login-student', passport.authenticate("student-local", {
    successRedirect : "dashboard.html",
    failureRedirect : "accounts/login/account_login.html"
}))

app.post('/login-teacher', passport.authenticate('teacher-local',{
    successRedirect : "dashboard.html",
    failureRedirect : "accounts/login/account_login.html"
}))

//REGISTRATION
app.post('/register-student', (req, res) => {
    let temp = req.body;
    let student_temp = new Account_Student(temp.email, temp.username, temp.password);
    for(i = 0; i < students.length; i++){
        if(students[i].username === temp.username){
            res.status(1062).json({message : "error"})
            return;
        }
    }
    students.push(student_temp);
    console.log(student_temp.email + " " + student_temp.username);
    res.json({message : "success"});
}) 

app.post('/register-teacher', (req, res) => {
    let temp = req.body;
    let teacher_temp = new Account_Teacher(temp.email, temp.username, temp.password);
    for(i = 0; i < teachers.length; i++){
        if(teachers[i] === temp.username){
            res.status(1062).json({message : "error"})
                return;
        }
    }
    teachers.push(teacher_temp);
    console.log(teacher_temp.email + " " + teacher_temp.username);
    res.json({message : "success"})
})

//VIDEO CHAT BACKEND LOGIC
io.on("connection", (socket) => {
    socket.on("ice-candidate", (candidate) => { 
        socket.broadcast.emit("ice-candidate", candidate);
    });

    socket.on("offer", (offer) => {
        socket.broadcast.emit("offer", offer);
    });

    socket.on("answer", (answer) => {
        socket.broadcast.emit("answer", answer);
    });
});

app.get('/video_chat', isAuthenticated, (req, res) => {
    if(!req.user){
        console.log("not authenticated");
    }
    console.log(req.user);
    const filePath = path.join(__dirname, 'public', 'matching', 'video_chat.html');
    console.log(`Sending file: ${filePath}`);
    
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(`Error sending file: ${err}`);
            res.status(err.status).end();
        } else {
            console.log('File sent successfully');
        }
    });
})


//STARTING THE SERVER
app.listen(port, "0.0.0.0", () => {
    console.log("Site started on : 64.188.16.151:" + port);
})