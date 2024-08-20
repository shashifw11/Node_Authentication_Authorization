const express = require("express");
const { register,login } = require("./controllers/auth.controller");
const app = express();

//app.use("/users", useController)
// initially i wrote app.use("/users", userController) and than after it goes inside the userCOntroller
// than we write routes for ("/register") than the url is like /users/register but its not correct to write route for register
// routes are writen directly as http://localhost:2345/register so we can directly write method here with routes so we can reduce extra routes to access userController
//
app.use(express.json());
app.post("/register", register); 
app.post("/login", login); 
// for writing routes directily like as /register we can not write app.use , and we write app.post so inside the controller no need to find method post and another name for routes. inside the useController only register function is writen

module.exports = app;
