const express = require("express");
const morgan = require("morgan");

const userRouter = require("./routes/user/user.router");

const app = express();

app.use(morgan("combined"));
app.use(express.json());

app.get("/test", (req, res) => {
  res.status(200).send("connection was ok");
});
app.use("/", userRouter);
module.exports = app;
