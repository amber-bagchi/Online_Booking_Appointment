require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const sequelize = require("./utils/db");

const routes = require("./routes");


app.use(cors());
app.use(express.json());

app.use("/api", routes);

async function startServer() {
  try {
    await sequelize.sync({ alter: true });
    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
  } catch (err) {
    console.log(err);
  }
}

startServer();
