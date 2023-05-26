import express from "express";
import bcrypt from "bcrypt";
import ExpressMongoSanitize from "express-mongo-sanitize";
import { User } from "../models/User";
import { logWrite } from "../utilities/log";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
const urlEncodedParser = bodyParser.urlencoded({ extended: true });
var router = express.Router();
router.get(
  "/admin",
  [cookieParser()],
  async (request: express.Request, response: express.Response) => {
    const usernameCookie = request.cookies?.username;
    const sessionTokenCookie = request.cookies?.sessionToken;
    if (!usernameCookie || !sessionTokenCookie) {
      logWrite.info(`Cookies not provided.`);
      response.redirect("/dashboard");
      return;
    }
    const username = ExpressMongoSanitize.sanitize(usernameCookie);
    const sessionToken = ExpressMongoSanitize.sanitize(sessionTokenCookie);
    const user = await User.findOne({ username: usernameCookie }).select({
      password: 0,
    });
    if (!user) {
      logWrite.info(`User ${username} not found while checking cookies.`);
      response.redirect("/dashboard");
      return;
    }
    const cookieResult = await bcrypt.compare(sessionToken, user.sessionToken);
    if (!cookieResult) {
      logWrite.info(`Incorrect cookies for user ${username}`);
      response.redirect("/dashboard");
      return;
    }
    const adminResult =
      user.membership.isSuperAdministrator || user.membership.isAdministrator;
    if (!adminResult) {
      logWrite.info(`Low permissions for user ${username}`);
      response.redirect("/dashboard");
      return;
    }
    response.render("pages/admin");
  }
);

router.post(
  "/admin",
  [urlEncodedParser, cookieParser()],
  async (request: express.Request, response: express.Response) => {
    const usernameCookie = request.cookies?.username;
    const sessionTokenCookie = request.cookies?.sessionToken;
    if (!usernameCookie || !sessionTokenCookie) {
      logWrite.info(`Cookies not provided.`);
      response.redirect("/dashboard");
      return;
    }
    const username = ExpressMongoSanitize.sanitize(usernameCookie);
    const sessionToken = ExpressMongoSanitize.sanitize(sessionTokenCookie);
    const user = await User.findOne({ username: usernameCookie }).select({
      password: 0,
    });
    if (!user) {
      logWrite.info(`User ${username} not found while checking cookies.`);
      response.redirect("/dashboard");
      return;
    }
    const cookieResult = await bcrypt.compare(sessionToken, user.sessionToken);
    if (!cookieResult) {
      logWrite.info(`Incorrect cookies for user ${username}`);
      response.redirect("/dashboard");
      return;
    }
    const adminResult =
      user.membership.isSuperAdministrator || user.membership.isAdministrator;
    if (!adminResult) {
      logWrite.info(`Low permissions for user ${username}`);
      response.redirect("/dashboard");
      return;
    }
    // give money
    const moneyAmount = request.body["money-amount"];
    const moneyRecipient = ExpressMongoSanitize.sanitize(
      request.body["money-recipient"]
    );
    if (moneyAmount && moneyRecipient) {
      await User.findOneAndUpdate(
        {
          username: moneyRecipient,
        },
        { $inc: { money: moneyAmount } }
      );
      logWrite.info(
        `Admin ${username} gave NRM${moneyAmount} to user ${moneyRecipient}`
      );
    }

    // give gems
    const gemAmount = request.body["gem-amount"];
    const gemRecipient = ExpressMongoSanitize.sanitize(
      request.body["gem-recipient"]
    );
    if (gemAmount && gemRecipient) {
      await User.findOneAndUpdate(
        {
          username: gemRecipient,
        },
        { $inc: { gems: gemAmount } }
      );
      logWrite.info(
        `Admin ${username} gave NRG${gemAmount} to user ${gemRecipient}`
      );
    }

    response.render("pages/admin");
  }
);
export { router };
