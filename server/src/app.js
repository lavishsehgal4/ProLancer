const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const userRouter = require("./routes/user/user.router");
const freelancerRouter = require("./routes/freelancers/freelancers.router");
const categoriesRouter = require("./routes/categories/categories.router");
const googleAuthRouter = require("./routes/googleAuth/googleAuth.router");
const emailRouter = require("./routes/email/email.router");
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
app.use(googleAuthRouter);
app.use("/", userRouter);
app.use("/", freelancerRouter);
app.use("/", categoriesRouter);
app.use("/api/user", emailRouter);

module.exports = app;
