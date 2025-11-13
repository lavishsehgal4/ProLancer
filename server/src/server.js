const http = require("http");

const connectDB = require("./services/mongo");

const app = require("./app");

const PORT = 8000;

const server = http.createServer(app);

async function startServer() {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
}
startServer();
