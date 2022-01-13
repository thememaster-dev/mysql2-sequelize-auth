const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sequelize = require("../util/database");
const User = require("../models/user");

//-------------------------------------------------------signup
router.post("/signup", async (req, res) => {
  try {
    const temUserName = req.body.name;
    const temUserEmail = req.body.email;
    const temUserPass = req.body.password;
    if (temUserName && temUserEmail && temUserPass) {
      if (
        temUserName.length > 0 &&
        temUserEmail.length > 0 &&
        temUserPass.length > 0
      ) {
        sequelize.sync().then(async () => {
          const isExist = await User.findOne({
            where: { email: temUserEmail },
          });
          if (isExist) {
            res.status(401).json({
              error: " email already signedup  ",
            });
          } else {
            const hashedPassword = await bcrypt.hash(temUserPass, 10);

            const newUser = await User.create({
              name: temUserName,
              email: temUserEmail,
              password: hashedPassword,
            });
            res.status(200).json({
              message: "Signup successful!",
            });
          }
        });
      } else {
        res.status(401).json({
          error: " name ,email and pass can not be empty",
        });
      }
    } else {
      res.status(401).json({
        error: "enter name ,email and pass",
      });
    }
  } catch {
    res.status(500).json({
      message: "signup failed",
    });
  }
});
//-------------------------------------------------------login
router.post("/login", async (req, res) => {
  try {
    const temUserName = req.body.name;

    const temUserPass = req.body.password;
    sequelize.sync().then(async () => {
      const isExist = await User.findOne({
        where: { name: temUserName },
      });
      if (isExist) {
        const isValidPassword = bcrypt.compareSync(
          temUserPass,
          isExist.password
        );
        if (isValidPassword) {
          //..................generate token
          const token = jwt.sign(
            {
              username: isExist.name,
              userId: isExist.id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
          );
          res.status(200).json({
            access_token: token,
            message: "Login successful!",
          });
        } else {
          res.status(401).json({
            error: "User name and password did not match",
          });
        }
      } else {
        res.status(401).json({
          error: "This user name is not signed up ",
        });
      }
    });
  } catch {
    res.status(500).json({
      error: "Authentication failed",
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    sequelize.sync().then(async () => {
      const allUser = await User.findAll();
      res.status(200).json({
        data: allUser,
      });
    });
  } catch (err) {
    res.status(500).json({
      message: "There are no user data!!",
    });
  }
});
module.exports = router;
