if (process.env.NODE_ENV) require("dotenv").config();

//connect database
require("./configs/mongo");

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./routes");
// const errorHandler = require("./middlewares/errorHandler");
const PORT = 3000
const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", routes);

// app.use(errorHandler);

app.listen(PORT, () => {
  console.log("app listening port ", PORT);
});

module.exports = app;