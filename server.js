/**
 * Basic implementation of Kaiwa's Backend
 * @author Yuyang Hu
 * @author Isaac Zhang
 * TODO: Switch to Moongoose for database, implement matching algorithim
 */
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Account_Student = require('./public/accounts/account_scripts/account_class_student.js');
const Account_Teacher = require('./public/accounts/account_scripts/account_class_teacher.js');
const app = express();
const port = 25565;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(session({
    secret : 'testing-key',
    resave : false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }
}));
teachers = [];
students = [];

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
    done(null, user.username);
})

passport.deserializeUser((id, done)=>{

})

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

app.post('/login-student', passport.authenticate("student-local", {
    successRedirect : "dashboard.html",
    failureRedirect : "accounts/login/account_login.html"
}))

app.post('/login-teacher', passport.authenticate('teacher-local',{
    successRedirect : "dashboard.html",
    failureRedirect : "accounts/login/account_login.html"
}))

app.listen(port, "0.0.0.0", () => {
    console.log("Site started on : 64.188.16.151:" + port);
})