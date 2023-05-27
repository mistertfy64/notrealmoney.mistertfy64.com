import cookieParser from "cookie-parser";
import { logWrite } from "../utilities/log";
import ExpressMongoSanitize from "express-mongo-sanitize";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import express from "express";
import { Transaction } from "../models/Transaction";
var router = express.Router();
router.get(
  "/dashboard",
  [cookieParser()],
  async (request: express.Request, response: express.Response) => {
    const usernameCookie = request.cookies?.username;
    const sessionTokenCookie = request.cookies?.sessionToken;
    if (!usernameCookie || !sessionTokenCookie) {
      logWrite.info(`Cookies not provided.`);
      response.redirect("/");
      return;
    }
    const username = ExpressMongoSanitize.sanitize(usernameCookie);
    const sessionToken = ExpressMongoSanitize.sanitize(sessionTokenCookie);
    const user = await User.findOne({ username: usernameCookie }).select({
      password: 0,
    });
    if (!user) {
      logWrite.info(`User ${username} not found while checking cookies.`);
      response.redirect("/");
      return;
    }
    const transactions = (await Transaction.find({ to: user._id })).reverse();
    const cookieResult = await bcrypt.compare(sessionToken, user.sessionToken);
    if (!cookieResult) {
      logWrite.info(`Incorrect cookies for user ${username}`);
      response.redirect("/");
      return;
    }
    const data = {
      user: user,
      transactions: transactions,
    };
    response.render("pages/dashboard", {
      data: data,
    });
  }
);
export { router };
