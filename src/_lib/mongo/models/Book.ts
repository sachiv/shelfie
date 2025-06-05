import mongoose from "mongoose";

const Book = new mongoose.Schema(
  {
    id: Number,
    ratings: [
      {
        rating: Number,
        comment: String,
        createdAt: { type: Date, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Book || mongoose.model("Book", Book);
