const express = require("express");
const router = express.Router();

const sequelize = require("../util/database");
const Blog = require("../models/blog");
const checkLogin = require("../middleware/checkLogin");

router.post("/", checkLogin, async (req, res) => {
  try {
    const blogTitle = req.body.title;
    const blogDescription = req.body.description;
    const image = req.body.image;
    if (blogTitle && blogDescription && image) {
      if (
        blogTitle.length > 0 &&
        blogDescription.length > 0 &&
        image.length > 0
      ) {
        sequelize.sync().then(async () => {
          const newBlog = await Blog.create({
            title: blogTitle,
            description: blogDescription,
            image: image,
            userName: req.username,
            userId: req.userId,
          });
          res.status(200).json({
            message: "Blog created",
          });
        });
      } else {
        res.status(401).json({
          message: "enter blogTitle  blogDescription  image's must be above 0 ",
        });
      }
    } else {
      res.status(401).json({
        message: "enter blogTitle  blogDescription  image ",
      });
    }
  } catch {
    res.status(500).json({
      message: "blog creation failed",
    });
  }
});

module.exports = router;
