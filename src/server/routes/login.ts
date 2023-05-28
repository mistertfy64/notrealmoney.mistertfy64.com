import express from "express";
import bodyParser from "body-parser";
import ExpressMongoSanitize from "express-mongo-sanitize";
import { User } from "../models/User";
import { logWrite } from "../utilities/log";
import bcrypt from "bcrypt";
import crypto from "crypto";
const urlEncodedParser = bodyParser.urlencoded({ extended: true });
var router = express.Router();
router.post(
  "/login",
  [urlEncodedParser],
  async (request: express.Request, response: express.Response) => {
    const username = ExpressMongoSanitize.sanitize(request.body.username);
    const password = ExpressMongoSanitize.sanitize(request.body.password);
    if (!username || !password) {
      logWrite.info("Username and/or password not provided.");
      response.redirect("/");
      return;
    }
    const user = await User.findOne({ username: username });
    if (!user) {
      logWrite.info(`User ${username} not found.`);
      response.redirect("/");
      return;
    }
    const passwordResult = await bcrypt.compare(password, user.password);
    if (!passwordResult) {
      logWrite.info(`Incorrect password for user ${username}`);
      response.redirect("/");
      return;
    }
    logWrite.info(`User ${username} logged in.`);
    const sessionToken = crypto.randomBytes(32).toString("hex");
    response.cookie("username", username, { httpOnly: true });
    response.cookie("sessionToken", sessionToken, {
      httpOnly: true,
    });
    response.redirect("/dashboard");
    // TODO: Unsafe?
    user.sessionToken = await bcrypt.hash(sessionToken, 8);
    user.save();
    return;
  }
);
export { router };
