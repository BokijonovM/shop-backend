import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import {
  unauthorizedHandler,
  forbiddenHandler,
  catchAllHandler,
} from "./errorHandlers.js";
import passport from "passport";
import usersRouter from "./services/users/user.js";
import googleStrategy from "./auth/oauth.js";
import shopsRouter from "./services/shops/shops.js";
import productsRouter from "./services/products/product.js";

const server = express();
const port = process.env.PORT || 3001;

passport.use("google", googleStrategy);

server.use(cors());
server.use(express.json());
server.use(passport.initialize());

server.use("/users", usersRouter);
server.use("/shops", shopsRouter);
server.use("/products", productsRouter);

server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(catchAllHandler);

mongoose.connect(process.env.MONGO_CONNECTION);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log("Server runnning on port: ", port);
  });
});
