import mongoose from "mongoose";

const Book = mongoose.Schema(
  {
    id: Number,
    ratings: [
      {
        rating: Number,
        comment: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Book || mongoose.model("Book", Book);
