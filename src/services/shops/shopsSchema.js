import mongoose from "mongoose";

const { Schema, model } = mongoose;

const shopSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    category: { type: String, required: true },
    cover: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    facebook: { type: String },
    telegram: { type: String },
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

shopSchema.static("findShopWithUser", async function (mongoQuery) {
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

export default model("Shop", shopSchema);
