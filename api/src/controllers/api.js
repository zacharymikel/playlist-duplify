"use strict";

import { Response, Request, NextFunction } from "express";


/**
 * GET /api
 * List of API examples.
 */
export const getApi = (req, res) => {
  res.json("Oh-loeeee");
};
