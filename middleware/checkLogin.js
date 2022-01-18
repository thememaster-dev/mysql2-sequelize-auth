const jwt = require("jsonwebtoken");
const checkLogin = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { username, userId } = decoded;
    req.username = username;
    req.userId = userId;

    next();
  } catch {
    next("Authentication failed!m");
  }
};

// const checkLogin = (req, res, next) => {
//   const { authorization } = req.headers;
//   try {
//     const token = authorization.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const { username, userId, exp } = decoded;

//     const currentTime = new Date();

//     if (currentTime.getTime() / 1000 > exp) {
//       res.status(401).json({
//         error: "Token expired",
//       });
//     } else {
//       req.username = username;
//       req.userId = userId;
//     }

//     next();
//   } catch {
//     next("Authentication failed!m");
//   }
// };
module.exports = checkLogin;
