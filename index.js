const express = require("express");

const port = 3000;

const user = require("./route/user");

const app = express();

app.use(express.json());

app.use("/user", user);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
