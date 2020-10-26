"use strict";

import logger from "../utilities/logger";
import express from "express";
import { echo } from "./echo";

const router = express.Router();

router.get("/echo", echo);

router.all("*", function (req, res) {
  res.status(404).json({
    status: 404,
    description: "API not found"
  });
});

export default router;
