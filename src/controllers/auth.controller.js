const User = require("../models/user.model");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const newToken = (user) => {
  //this will create a token which will be just a string a cheractors , when will you decript this it will give you user back
  return jwt.sign(
    { user: user , exp : 60*5},  
    process.env.JWT_SECRET_KEY
    // {algorithm: "RS256",  };// RS256 is an algrothim which use to Encrypt the tocken
    // how iam trying to get the details for one perticular user now i will ever be able to get the details of one perticular user.
    // frontend some how to tell me which user is trying to get the information right now
    // so for exapmle if user have an email xyz@gmail.com , so for us to know that , this frontend need to send somthing back like we discuss , this token as the intire user
    // so we get the token back we can decript back and get the intire user back.
  );
};

// there are two ways to do authentication 

// one statefull => we create a session on server // your server after send a response knows that this user are existed in the system. and it has the session save and for every session there is the cokkies on the browser.
// when we recive cookies in the request we already have the session on server with the cokkies and that is how we know who the user is , without needing any token or any thing . automatically we are able fetch the user from the session ,rather are we are fetching user from the token  we are fethcing from the session.

// two stateless => what we learn today it is stateless where there is nothing stored on the server. when the request comes in we get the token we take the token and get the user out of it, after the request is send it is sent we dont even remember that who the user was. the server has no momery after the response is sent.


const register = async (req, res) => {
  // first check that email is not already register
  // if yes than throw an error
  // if not than we will create the user
  // after creating the user we will not store the password what ever user create insted we will store the hash password
  // we will hash the password
  // all the api calls we are sending something called as an autherization header , it is a part of an requiest header , and this authrization header contains a token , so when ever user login or case in register this token and we have to the send this token to the frontend because the frontend is sending this token with every request
  // we have create this token for the user
  // return the token and the user

  try {
    // first check if user email is exist in database or not
    let user = await User.findOne({ email: req.body.email }).lean().exec();
    // if yes then throw an error 408 bad request
    if (user) {
      return res
        .status(400)
        .send({ message: "User with that email is already exist" });
    }
    // for hasing the password we will use bcrypt.js library , bcrypt is an algorithing that use for hasing the password
    // we will hash the password
    user = await User.create(req.body);
    //.selecte("-password"); // => select({password:0}) // now your are user your are not sending the password anymore so here select("-password") means your are sending everything except the password
    //take the user => encrypt the password => send to frontend => when frontend sends it back => decrypt the password =>and get the user back from database

    // we will create the token for user
    // there are many way to create the token like json web token
    const token = newToken(user);

    // return the token and user details  // here also you are not sending user with the password
    return res.status(201).send({ user, token }); // above in database we store the has pwd but we have to return token to user so we can create token and send it to user as response
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const login = async (req, res) => {
  // first we will find the user with email
  // if user is not found by email throw an error 400 bad resuest
  // if user email found then try to match the password provided with the password in db
  // if not match then  throw an error 400 bad request
  // if password also matches then create a token
  // return the token and the user details
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(400)
        .send({ message: "Either Email or password incorrect" });
    }

    const match = user.checkPassword(req.body.password); // it return either true or false
    if (!match) {
      return res
        .status(400)
        .send({ message: "Either Email or password incorrect" });
    }
    // if the email and password both are correct then we will create the token and we will return the token and user
    const token = newToken(user);
    return res.status(201).send({ user, token });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

module.exports = { register, login };

// when you incrypt the user you can get the token . // fronm frontend wehn we send the user details tha we encrypt it and create the token. and send it to frontend user and token, . token is unique for all user accordingly.
// when you bcrypt the token you can get the user. // when the frontend send the token then we return the user to frontend




