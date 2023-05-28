import express from "express";
import bodyParser from "body-parser";
var router = express.Router();
router.get(
  "/logout",
  async (request: express.Request, response: express.Response) => {
    response.clearCookie("username");
    response.clearCookie("sessionToken");
    response.redirect("/");
  }
);
export { router };
