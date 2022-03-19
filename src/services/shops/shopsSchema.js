import mongoose from "mongoose";

const { Schema, model } = mongoose;

const shopSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    category: { type: String, required: true },
    cover: { type: String },
    instagram: { type: String, unique: true },
    twitter: { type: String, unique: true },
    facebook: { type: String, unique: true },
    telegram: { type: String, unique: true },
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
      path: "users",
      select: "firstName lastName",
    });
  return { total, posts };
});

export default model("Shop", shopSchema);
