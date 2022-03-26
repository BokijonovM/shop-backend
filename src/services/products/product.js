import express from "express";
import ProductsModel from "./schema.js";
import q2m from "query-to-mongo";
import { JWTAuthMiddleware } from "../../auth/token.js";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const cloudinaryUpload1 = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "capstone products",
    },
  }),
}).single("image1");

const cloudinaryUpload2 = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "capstone products",
    },
  }),
}).single("image2");

const cloudinaryUpload3 = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "capstone products",
    },
  }),
}).single("image3");

const cloudinaryUpload4 = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "capstone products",
    },
  }),
}).single("image4");

const productsRouter = express.Router();

productsRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const total = await ProductsModel.findProductWithUser(mongoQuery);
    const shops = await ProductsModel.find(mongoQuery.criteria)
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

productsRouter.post("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const newProduct = new ProductsModel({ ...req.body, user: req.user._id });
    const { _id } = await newProduct.save();
    res.status(201).send(newProduct);
  } catch (error) {
    next(error);
  }
});

//***********************POST IMAGES**********************

productsRouter.post(
  "/:proId/image1",
  JWTAuthMiddleware,
  cloudinaryUpload1,
  async (req, res, next) => {
    try {
      const prodID = req.params.proId;
      const updated = await ProductsModel.findByIdAndUpdate(
        prodID,
        { image_1: req.file.path },
        {
          new: true,
        }
      );
      if (updated) {
        res.send(updated);
      } else {
        next(createHttpError(404, `Product with id ${prodID} not found!`));
      }
    } catch (error) {
      next(error);
    }
  }
);
productsRouter.post(
  "/:proId/image2",
  JWTAuthMiddleware,
  cloudinaryUpload2,
  async (req, res, next) => {
    try {
      const prodID = req.params.proId;
      const updated = await ProductsModel.findByIdAndUpdate(
        prodID,
        { image_2: req.file.path },
        {
          new: true,
        }
      );
      if (updated) {
        res.send(updated);
      } else {
        next(createHttpError(404, `Product with id ${prodID} not found!`));
      }
    } catch (error) {
      next(error);
    }
  }
);
productsRouter.post(
  "/:proId/image3",
  JWTAuthMiddleware,
  cloudinaryUpload3,
  async (req, res, next) => {
    try {
      const prodID = req.params.proId;
      const updated = await ProductsModel.findByIdAndUpdate(
        prodID,
        { image_3: req.file.path },
        {
          new: true,
        }
      );
      if (updated) {
        res.send(updated);
      } else {
        next(createHttpError(404, `Product with id ${prodID} not found!`));
      }
    } catch (error) {
      next(error);
    }
  }
);
productsRouter.post(
  "/:proId/image4",
  JWTAuthMiddleware,
  cloudinaryUpload4,
  async (req, res, next) => {
    try {
      const prodID = req.params.proId;
      const updated = await ProductsModel.findByIdAndUpdate(
        prodID,
        { image_4: req.file.path },
        {
          new: true,
        }
      );
      if (updated) {
        res.send(updated);
      } else {
        next(createHttpError(404, `Product with id ${prodID} not found!`));
      }
    } catch (error) {
      next(error);
    }
  }
);
export default productsRouter;
