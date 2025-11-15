const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const userRouter = require("./routes/user/user.router");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(morgan("combined"));
app.use(express.json());

app.get("/test", (req, res) => {
  res.status(200).send("connection was ok");
});
app.use("/", userRouter);
module.exports = app;
