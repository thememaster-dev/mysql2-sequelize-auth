const express = require("express");

const port = 3000;

const user = require("./route/user");
const blog = require("./route/blog");

const app = express();

app.use(express.json());

app.use("/user", user);
app.use("/blog", blog);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
