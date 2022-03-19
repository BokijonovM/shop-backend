import express from "express";
import createHttpError from "http-errors";
import UsersModel from "./userSchema.js";
import passport from "passport";
import { adminOnlyMiddleware } from "../../auth/admin.js";
import { JWTAuthMiddleware } from "../../auth/token.js";

const usersRouter = express.Router();

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UsersModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    next(
      createHttpError(400, "Some errors occurred in usersRouter.post body!", {
        message: error.message,
      })
    );
  }
});

usersRouter.get(
  "/",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const user = await UsersModel.find();
      res.send(user);
    } catch (error) {
      next(
        createHttpError(400, "Some errors occurred in usersRouter body!", {
          message: error.message,
        })
      );
    }
  }
);

usersRouter.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

usersRouter.get(
  "/googleRedirect",
  passport.authenticate("google"),
  (req, res, next) => {
    try {
      console.log(req.user.token);

      if (req.user.role === "Admin") {
        res.redirect(`${process.env.FE_URL}?accessToken=${req.user.token}`);
      } else {
        res.redirect(`${process.env.FE_URL}?accessToken=${req.user.token}`);
      }
    } catch (error) {
      console.log(error);
      next(
        createHttpError(400, "Some errors occurred in usersRouter body!", {
          message: error.message,
        })
      );
    }
  }
);

usersRouter.get("/:userId", async (req, res, next) => {
  try {
    const idOfUser = req.params.userId;

    const user = await UsersModel.findById(idOfUser);
    if (user) {
      res.send(user);
    } else {
      next(createHttpError(404, `User with id ${idOfUser} not found!`));
    }
  } catch (error) {
    next(
      createHttpError(400, "Some errors occurred in usersRouter body!", {
        message: error.message,
      })
    );
  }
});

usersRouter.put("/:userId", async (req, res, next) => {
  try {
    const userID = req.params.userId;
    const updatedUser = await UsersModel.findByIdAndUpdate(userID, req.body, {
      new: true,
    });
    if (updatedUser) {
      res.send(updatedUser);
    } else {
      next(createHttpError(404, `User with id ${userID} not found!`));
    }
  } catch (error) {
    next(
      createHttpError(400, "Some errors occurred in usersRouter body!", {
        message: error.message,
      })
    );
  }
});

usersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const userID = req.params.userId;
    const deletedUser = await UsersModel.findByIdAndDelete(userID);
    if (deletedUser) {
      res.status(204).send(`User with id ${userID} deleted!`);
    } else {
      next(createHttpError(404, `User with id ${userID} not found!`));
    }
  } catch (error) {
    next(
      createHttpError(400, "Some errors occurred in usersRouter body!", {
        message: error.message,
      })
    );
  }
});

export default usersRouter;
