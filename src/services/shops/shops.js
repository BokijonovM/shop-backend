import express from "express";
import createHttpError from "http-errors";
import ShopsModel from "./shopsSchema.js";
import q2m from "query-to-mongo";
import { adminOnlyMiddleware } from "../../auth/admin.js";
import { JWTAuthMiddleware } from "../../auth/token.js";
import { authenticateUser } from "../../auth/tools.js";

const shopsRouter = express.Router();

export default shopsRouter;
