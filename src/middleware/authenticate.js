const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (token) => { // create a function that return a promise which gives us reject or resolve
  console.log("token", token); // here i am reciving token here
  return new Promise((resolve, reject) => {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
      return reject(new Error("JWT secret is not defined"));
    }

    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        return reject(err);
      } else {
        resolve(decoded); // decoded is the user object
      }
    });
  });
};

const authenticate = async (req, res, next) => {
  // check if authentication token is inside the reqest headers
  // if not then throw an error 400 bad request
  // if yes then check that its a bearer token
  // if not a baerer token than throw an error 400 Bad request
  // if yes then verify the token and get the user from the token
  // attach the user to the request
  // return next();

  if (!req?.headers?.authorization) {
    return res
      .status(400)
      .send({ message: "please provide a valid authorization token" });
  }

  const bearerToken = req.headers.authorization; // store the baerer token with baerer
  if (!bearerToken.startsWith("Bearer")) {
    // if token not start with Bearer name than shows error
    return res
      .status(400)
      .send({ message: "please provide a valid authorization token" });
  }

  const token = bearerToken.split(" ")[1]; // collecting the token form baerer token string

  try {
    const user = await verifyToken(token); // while createing the token we use newToken but here we create the verifyToken for verifying the token.
    req.user = user.user;
    console.log("user",req.user);
    next();
  } catch (err) {
    return res.status(401).send({ message: "Token is not valied" }); // when the token expire backend return 401 error and the frontend has a check is it ever recivs 401 then the user return back to the login page
  }
};

module.exports = authenticate;


