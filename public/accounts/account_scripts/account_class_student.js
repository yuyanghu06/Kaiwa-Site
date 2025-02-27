/*
This is an implementation of an account object
@author Yuyang Hu
@author Isaac Zhang
*/
class Account_Student {
    constructor(email, username, password){
        this.email = email;
        this.username = username;
        this.password = password;
        this.student = true;
    }
}

if (typeof module === 'object') {
    module.exports = Account_Student;
}
