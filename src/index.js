"use strict";

import express from "express";
import bodyParser from "body-parser";
import _ from "./utilities/env";
import cors from "cors";

const app = express();

app.get("/health", (req, res) => {
  return res.status(200).json({
    status: 200,
    descriptions: "Health"
  });
});

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.listen(process.env.PORT, (error, server) => {
  if (error) {
    logger.error({ err }, "Failed to start server");
  } else {
    logger.info(`Started server on ${process.env.PORT}`);
  }
});

export default app;
