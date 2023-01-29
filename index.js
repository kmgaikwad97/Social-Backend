const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");

// env
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT;

// routes import
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");

// mongodb connection
require("./config/db");

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.listen(port, () => {
  console.log(`Connected to the ${port}`);
});
