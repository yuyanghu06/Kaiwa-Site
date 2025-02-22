/*
This is an implementatinon of a teacher object
@author Yuyang Hu
@author Isaac Zhang
*/
class Account_Teacher{
    constructor(email, username, password){
        this.email = email;
        this.password = password;
        this.username = username;
        this.teacher = true;
    }
}
module.exports = Account_Teacher;