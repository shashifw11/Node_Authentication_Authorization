const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// there are two way of creating something
// 1) user = User.create(req.body)
// 2) user = new User() ; or user = User.findOne() ;  user.email = "skjhdjgbj" ;  user.save()
userSchema.pre("save", function (next) {
  // mongoose gives us some hooks that can help us to perform some task
  // here before svae the document into database , we want to do something with it

  if (!this.isModified("password")) {
    return next();
  }
  try {
    // here we are creating a user or we are updating the user we have to hash the password
    // salt => random string of characters   pwd + salt = new string called hash
    this.password = bcrypt.hashSync(this.password, 8); // and hash again hash till 8 times so written the number 8 and that hash pwd store the database
    return next(); // update the password with the hash which was created by bcrypt
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.checkPassword = function (password) { // we put this check password function on the user prototype.
  const match = bcrypt.compareSync(password, this.password);
  return match;
};

const User = mongoose.model("user", userSchema);

module.exports = User;
