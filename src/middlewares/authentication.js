"use strict";

import logger from "../utilities/logger";
import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
import request from "request-promise";

const validateCognitoToken = async (req, res, next) => {
  try {

    /*************
    * Skip validating
    **************/
    let regexRoutePath = (/(apis)*(admin)*()/i);

    if (regexRoutePath.test(req.path) == true) {
      logger.info("Admin Call");
      logger.info(`Request: ${req.method} ${req.path} User=Admin`);
      return next();
    }

    /*************
     * Validate AWS access token
     **************/
    let token = req.headers["authorization"];

    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    } else if (!token) {
      return res.status(401).json({
        status: 401,
        error: "Missing bearer token"
      });
    }

    var options = {
      url: process.env.AWS_COGNITO_AUTH_URL,
      json: true,
      resolveWithFullResponse: true
    };
    let response = await request(options);
    let payload = {};
    if (response.statusCode === 200) {
      let pems = {};
      let keys = response.body["keys"];
      for (let i = 0; i < keys.length; i++) {
        //Convert each key to PEM
        let key_id = keys[i].kid;
        let modulus = keys[i].n;
        let exponent = keys[i].e;
        let key_type = keys[i].kty;
        let jwk = { kty: key_type, n: modulus, e: exponent };
        let pem = jwkToPem(jwk);
        pems[key_id] = pem;
      }
      //validate the token
      var decodedJwt = jwt.decode(token, { complete: true });
      if (!decodedJwt) {
        return res.status(401).json({
          status: 401,
          error: "Invalid token"
        });
      } else {
        let kid = decodedJwt.header.kid;
        let pem = pems[kid];
        if (!pem) {
          return res.status(401).json({
            status: 401,
            error: "Invalid token"
          });
        }
        payload = await jwt.verify(token, pem);
      }
    } else {
      return res.status(401).json({
        status: 401,
        error: "Unable to download JWKs"
      });
    }

    if (!payload.sub) {
      return res.status(401).json({
        status: 401,
        error: "payload.sub not found"
      });
    }
    req.userId = payload.sub;
    logger.info(
      `Request: ${req.method} ${req.path} User=${req.userId} From Cognito token`
    );
    return next();
  } catch (err) {
    if (err.name && err.name === "TokenExpiredError") {
      return res.status(401).json({
        status: 401,
        error: "CognitoTokenExpired"
      });
    }

    if (err.name && err.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: 401,
        error: "CognitoTokenInvalid"
      });
    }

    logger.error(err.name);
    return res.status(500).send({
      status: 500,
      description: "Internal Error"
    });
  }
};

const authenticationForLocalTesting = (req, res, next) => {
  let userId = "d3bb06e7-4fa6-45da-a33d-8e3505d92342";
  req.userId = userId;
  logger.info(`Request: ${req.method} ${req.path} User=${req.userId}`);
  next();
};

export {
  validateCognitoToken,
  authenticationForLocalTesting
};
