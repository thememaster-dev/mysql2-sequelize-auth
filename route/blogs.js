const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

require("dotenv").config();
const port = process.env.PORT;
const uploadFolder = "uploads";

const sequelize = require("../util/database");
const Blog = require("../models/blog");
const checkLogin = require("../middleware/checkLogin");

const imgArr = [];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);

    const fileName =
      file.originalname
        .replace(fileExt, "")
        .toLowerCase()
        .split(" ")
        .join("_") +
      "_" +
      Date.now();

    const name = fileName + fileExt;
    imgArr.push(name);

    cb(null, name);
    return name;
  },
});

// storage control end ----------------
const upload = multer({
  storage: storage,

  limits: {
    fileSize: 5000000000000000000000,
  },

  preservePath: uploadFolder,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "images") {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(new Error("only .jpg,.png,jpeg format allowed"));
      }
    } else {
      cb(new Error("wrong feild !!!"));
    }
  },
});

router.post(
  "/",
  checkLogin,
  upload.fields([{ name: "images", maxCount: 1 }]),
  async (req, res) => {
    try {
      const reqObj = JSON.parse(req.body.data);

      const blogTitle = reqObj.title;
      const blogDescription = reqObj.description;

      if (blogTitle && blogDescription) {
        if (blogTitle.length > 0 && blogDescription.length > 0) {
          const imgPath = `/image/${imgArr[0]}`;

          sequelize.sync().then(async () => {
            const newBlog = await Blog.create({
              title: blogTitle,
              description: blogDescription,
              image: imgPath,
              userName: req.username,
              userId: req.userId,
            });
            imgArr.pop();
            res.status(200).json({
              message: "Blog created",
            });
          });
        } else {
          res.status(401).json({
            message: "length of blogTitle  blogDescription   must be above 0 ",
          });
        }
      } else {
        res.status(401).json({
          message: "enter blogTitle  blogDescription  ",
        });
      }
    } catch {
      res.status(500).json({
        message: "blog creation failed",
      });
    }
  }
);

module.exports = router;
