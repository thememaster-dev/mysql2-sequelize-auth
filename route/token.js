const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
// const tokenAuth = (req, res, next) => {
//   const { authorization } = req.headers;
//   try {
//     const token = authorization.split(" ")[1];
//     jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
//       if (err) {
//         err = {
//           name: "TokenExpiredError",
//           message: "jwt expired",
//           expiredAt: decoded.exp,
//         };
//         res.status(401).json({
//           err,
//         });
//       }
//     });

//     next();
//   } catch {
//     next("token err");
//   }
// };

router.get("/", async (req, res) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        err = {
          name: "TokenExpiredError",
          message: "jwt expired",
          expiredAt: decoded.exp,
        };
        res.status(401).json({
          err,
        });
      } else {
        res.status(200).json({
          message: "token is valid",
        });
      }
    });
  } catch (err) {
    res.status(500).json({
      message: "token err",
    });
  }
});
module.exports = router;
