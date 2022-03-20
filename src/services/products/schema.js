import mongoose from "mongoose";
import searchable from "mongoose-regex-search";

const { Schema, model } = mongoose;

const productsSchema = new Schema(
  {
    name: { type: String, required: true, searchable: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true, searchable: true },
    countryMade: { type: String, required: true },
    category: { type: String, required: true, searchable: true },
    image_1: { type: String, required: true },
    image_2: { type: String, required: true },
    image_3: { type: String },
    image_4: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

productsSchema.plugin(searchable);

productsSchema.static("findProductWithUser", async function (mongoQuery) {
  const total = await this.countDocuments(mongoQuery.criteria);
  const posts = await this.find(mongoQuery.criteria)
    .limit(mongoQuery.options.limit)
    .skip(mongoQuery.options.skip)
    .sort(mongoQuery.options.sort)
    .populate({
      path: "user",
      select: "firstName lastName email role",
    });
  return { total, posts };
});

export default model("Product", productsSchema);
