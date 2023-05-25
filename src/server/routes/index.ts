import express from "express";
var router = express.Router();
import path from "path";
import fs from "fs";
router.get("/", async (request: any, response: any) => {
  response.render("pages/index");
});
export { router };
