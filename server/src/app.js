const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const userRouter = require("./routes/user/user.router");
const freelancerRouter = require("./routes/freelancers/freelancers.router");
const clientRouter=require('./routes/clients/clients.router');
const categoriesRouter = require("./routes/categories/categories.router");
const googleAuthRouter = require("./routes/googleAuth/googleAuth.router");
const emailRouter = require("./routes/email/email.router");
const jobsRouter=require('./routes/jobs/jobs.router');
const sseRouter = require("./routes/sse/events.router");
const workspaceRouter = require("./routes/workspace/workspace.router");
const fileRouter=require("./routes/workspace/file.router");
const chatRouter=require("./chat/chat.router");
const commentRouter=require("./routes/comments/comments.router");
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
app.use("/",clientRouter);
app.use("/", categoriesRouter);
app.use("/api/user", emailRouter);
app.use("/",jobsRouter);
app.use("/events", sseRouter);
app.use("/workspace", workspaceRouter);
app.use("/files", fileRouter);
app.use("/chat", chatRouter);
app.use("/",commentRouter);

module.exports = app;
