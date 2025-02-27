const express = require('express');
const Account_Student = require('./public/accounts/account_scripts/account_class_student.js');
const Account_Teacher = require('./public/accounts/account_scripts/account_class_teacher.js');
const app = express();
const port = 25565;


app.use(express.static('public'));
app.use(express.json());
teachers = [];
students = [];

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



app.listen(port, "0.0.0.0", () => {
    console.log("Site started on : 64.188.16.151:" + port);
})