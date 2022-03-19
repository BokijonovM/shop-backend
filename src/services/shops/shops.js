import express from "express";
import createHttpError from "http-errors";
import ShopsModel from "./shopsSchema.js";
import q2m from "query-to-mongo";
import { JWTAuthMiddleware } from "../../auth/token.js";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const cloudinaryUpload = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "capstone shops",
    },
  }),
}).single("image");

const shopsRouter = express.Router();

shopsRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const total = await ShopsModel.findShopWithUser(mongoQuery);
    const shops = await ShopsModel.find(mongoQuery.criteria)
      .populate({
        path: "user",
        select: ["_id", "firstName", "lastName", "role", "email"],
      })
      .sort(mongoQuery.options.sort)
      .skip(mongoQuery.options.skip)
      .limit(mongoQuery.limit);
    // res.send(shops);
    res.send({
      total,
    });
  } catch (error) {
    next(error);
  }
});

shopsRouter.post("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const newBlog = new ShopsModel({ ...req.body, user: req.user._id });
    const { _id } = await newBlog.save();
    res.status(201).send(newBlog);
  } catch (error) {
    next(error);
  }
});

shopsRouter.post(
  "/:shopId/image",
  JWTAuthMiddleware,
  cloudinaryUpload,
  async (req, res, next) => {
    try {
      const userId = req.params.shopId;
      const updated = await ShopsModel.findByIdAndUpdate(
        userId,
        { cover: req.file.path },
        {
          new: true,
        }
      );
      if (updated) {
        res.send(updated);
      } else {
        next(createHttpError(404, `User with id ${userId} not found!`));
      }
    } catch (error) {
      next(error);
    }
  }
);

shopsRouter.get("/:shopId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const shopID = req.params.shopId;

    const shop = await ShopsModel.findById(shopID);
    if (shop) {
      res.send(shop);
    } else {
      next(createHttpError(404, `Shop with id ${shopID} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

shopsRouter.put("/:shopId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const shopID = req.params.shopId;
    const updatedShop = await ShopsModel.findByIdAndUpdate(shopID, req.body, {
      new: true,
    });
    if (updatedShop) {
      res.send(updatedShop);
    } else {
      next(createHttpError(404, `Shop with id ${shopID} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

shopsRouter.delete("/:shopId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const shopID = req.params.shopId;
    const deletedShop = await ShopsModel.findByIdAndDelete(shopID);
    if (deletedShop) {
      res.status(204).send(`Shop with id ${shopID} deleted!`);
    } else {
      next(createHttpError(404, `Shop with id ${shopID} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default shopsRouter;
