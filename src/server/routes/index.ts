import express from "express";
var router = express.Router();
router.get(
  "/",
  async (request: express.Request, response: express.Response) => {
    response.render("pages/index");
  }
);
export { router };
