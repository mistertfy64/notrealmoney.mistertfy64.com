import express from "express";
import mongoose from "mongoose";
import { logWrite } from "./utilities/log";
import path from "path";
require("dotenv").config();
const app = express();
app.use(express.static(__dirname + `/server/public`));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, `server/views`));
require("fs")
  .readdirSync(require("path").join(__dirname, `./routes`))
  .forEach((filePath: string) => {
    app.use(require(`./routes/` + filePath).router);
  });
mongoose.connect(process.env.MONGODB_URI || "");
mongoose.connection.on("connected", () => {
  console.log(logWrite.info("Successfully connected to mongoose."));
});
app.listen(10002, () => {
  logWrite.info("App listening at http://localhost:10002");
});
module.exports = app;
