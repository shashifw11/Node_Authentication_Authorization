const authorise = (permittedRoles) => {
  // permittedRoles => ["seller","admin"]
  // here we need to check user is comming in argument has atleast one of these role => seller , admin
  return (req, res, next) => {
    const user = req.user; // because user is creating the product so we will perform checking on user is admin or seller or anything else
    let isAllowed = false;
    for (let i = 0; i < user.roles.length; i++) {
      if (permittedRoles.includes(user.roles[i])) {
        // here we checking that permittedRoles are equal to any of the user roles or not if matches than isAllowd set true.
        isAllowed = true;
        break;
      }
    }
    if (isAllowed) {
      next();
    } else {
      return res.status(403).send({ message: "Permission denied" });
    }
  };
};

module.exports = authorise;
