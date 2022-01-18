const express = require("express");
const fs = require("fs");
const cors = require('cors')

require("dotenv").config();
const x = process.env.PORT;
const port = parseInt(x);

const users = require("./route/users");
const blogs = require("./route/blogs");
const token = require("./route/token");
const checkLogin = require("./middleware/checkLogin");

const app = express();

app.use(cors())
app.use(express.json());

const dir = "uploads";

fs.exists(dir, function (exists) {
  if (!exists) {
    fs.mkdirSync(dir);
  }
});

app.use("/users", users);
app.use("/blogs", blogs);
app.use("/token", token);

app.use("/image", checkLogin, express.static(__dirname + "/uploads"));

//default errorhandler---------------------------------------------------------delet end
const errorHandler = (err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
};
app.use(errorHandler);
app.listen(port, () => {
  console.log(` app listening at http://localhost:${port}`);
});
